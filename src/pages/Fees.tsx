import { useEffect, useState } from 'react';
import { Plus, DollarSign, CheckCircle, TrendingDown, TrendingUp, PieChart, Trash2, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Finance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'fees' | 'expenses' | 'reports'>('fees');
  const [fees, setFees] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Modals
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Forms
  const [feeForm, setFeeForm] = useState({ student_id: '', title: '', amount: '', due_date: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', category: 'General', date: '', description: '' });

  useEffect(() => {
    fetchFees();
    fetchExpenses();
    fetchStats();
    fetch('/api/students').then(res => res.json()).then(setStudents).catch(console.error);
  }, []);

  const fetchFees = () => fetch('/api/fees').then(r => r.json()).then(setFees);
  const fetchExpenses = () => fetch('/api/expenses').then(r => r.json()).then(setExpenses);
  const fetchStats = () => fetch('/api/stats').then(r => r.json()).then(setStats);

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/fees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feeForm)
    });
    setIsFeeModalOpen(false);
    fetchFees();
    fetchStats();
    setFeeForm({ student_id: '', title: '', amount: '', due_date: '' });
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expenseForm, recorded_by: user?.id })
    });
    setIsExpenseModalOpen(false);
    fetchExpenses();
    fetchStats();
    setExpenseForm({ title: '', amount: '', category: 'General', date: '', description: '' });
  };

  const markAsPaid = async (id: number) => {
    if (confirm('Mark this fee as PAID?')) {
      await fetch(`/api/fees/${id}/pay`, { method: 'PATCH' });
      fetchFees();
      fetchStats();
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (confirm('Delete this expense record?')) {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      fetchExpenses();
      fetchStats();
    }
  };

  // Report Data
  const reportData = [
    { name: 'Income', value: stats?.feesCollected || 0, color: '#10B981' },
    { name: 'Expenses', value: stats?.totalExpenses || 0, color: '#EF4444' },
  ];

  const profit = (stats?.feesCollected || 0) - (stats?.totalExpenses || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance Management</h1>
          <p className="text-slate-500">Track fees, expenses, and financial health</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'fees', label: 'Fees Collection', icon: DollarSign },
            { id: 'expenses', label: 'Expenses', icon: TrendingDown },
            { id: 'reports', label: 'Reports', icon: PieChart },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-slate-400">Total Collected</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${stats?.feesCollected || 0}</h3>
          <p className="text-sm text-slate-500">From student fees</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-medium text-slate-400">Total Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${stats?.totalExpenses || 0}</h3>
          <p className="text-sm text-slate-500">Salaries & Maintenance</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className={clsx("p-3 rounded-lg", profit >= 0 ? "bg-blue-50" : "bg-orange-50")}>
              <DollarSign className={clsx("w-6 h-6", profit >= 0 ? "text-blue-600" : "text-orange-600")} />
            </div>
            <span className="text-xs font-medium text-slate-400">Net Balance</span>
          </div>
          <h3 className={clsx("text-2xl font-bold", profit >= 0 ? "text-blue-600" : "text-orange-600")}>
            ${profit}
          </h3>
          <p className="text-sm text-slate-500">Available funds</p>
        </div>
      </div>

      {activeTab === 'fees' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Fee Invoices</h3>
            <button
              onClick={() => setIsFeeModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{fee.student_name}</div>
                      <div className="text-slate-500 text-xs font-mono">{fee.admission_no}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{fee.title}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${fee.amount}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(fee.due_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        fee.status === 'paid' ? "bg-emerald-100 text-emerald-800" :
                        fee.status === 'pending' ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      )}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {fee.status !== 'paid' && (
                        <button 
                          onClick={() => markAsPaid(fee.id)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No fee records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Expense Records</h3>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Record Expense
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Recorded By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{expense.title}</div>
                      <div className="text-slate-500 text-xs">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-red-600">-${expense.amount}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{expense.recorded_by_name}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No expenses recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-6">Income vs Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {reportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-6">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Total Income</p>
                    <p className="text-xs text-slate-500">Fees Collected</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-600">${stats?.feesCollected || 0}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Total Expenses</p>
                    <p className="text-xs text-slate-500">Operational Costs</p>
                  </div>
                </div>
                <span className="font-bold text-red-600">${stats?.totalExpenses || 0}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Pending Fees</p>
                    <p className="text-xs text-slate-500">Uncollected Revenue</p>
                  </div>
                </div>
                <span className="font-bold text-amber-600">${stats?.pendingFees || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee Modal */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Create Fee Invoice</h2>
              <button onClick={() => setIsFeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateFee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Student</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={feeForm.student_id}
                  onChange={e => setFeeForm({...feeForm, student_id: e.target.value})}
                >
                  <option value="">Select Student</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fee Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Tuition Fee - Term 1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={feeForm.title}
                  onChange={e => setFeeForm({...feeForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>
                <input
                  required
                  type="number"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={feeForm.amount}
                  onChange={e => setFeeForm({...feeForm, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={feeForm.due_date}
                  onChange={e => setFeeForm({...feeForm, due_date: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Record Expense</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expense Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Office Supplies"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={expenseForm.title}
                  onChange={e => setExpenseForm({...expenseForm, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($)</label>
                  <input
                    required
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Salary">Salary</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={expenseForm.date}
                  onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
