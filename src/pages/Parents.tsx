import { useEffect, useState } from 'react';
import { Plus, Search, Link as LinkIcon, UserPlus, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function Parents() {
  const [parents, setParents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });
  const [linkForm, setLinkForm] = useState({ student_id: '' });

  useEffect(() => {
    fetchParents();
    fetch('/api/students').then(res => res.json()).then(setStudents).catch(console.error);
  }, []);

  const fetchParents = () => {
    fetch('/api/parents')
      .then(res => res.json())
      .then(setParents)
      .catch(console.error);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        fetchParents();
        setCreateForm({ name: '', email: '', password: '' });
      } else {
        alert('Failed to create parent');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParent) return;
    
    try {
      const res = await fetch('/api/parents/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id: selectedParent.id, student_id: linkForm.student_id }),
      });
      if (res.ok) {
        setIsLinkModalOpen(false);
        fetchParents();
        setLinkForm({ student_id: '' });
        alert('Student linked successfully');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openLinkModal = (parent: any) => {
    setSelectedParent(parent);
    setIsLinkModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parents</h1>
          <p className="text-slate-500">Manage parent accounts and student links</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Parent
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Linked Students</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {parents.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{parent.name}</td>
                  <td className="px-6 py-4 text-slate-600">{parent.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {parent.student_count} Students
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(parent.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openLinkModal(parent)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Link Student
                    </button>
                  </td>
                </tr>
              ))}
              {parents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No parent accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Create Parent Account</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={createForm.name}
                  onChange={e => setCreateForm({...createForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={createForm.email}
                  onChange={e => setCreateForm({...createForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Leave empty for default: parent123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={createForm.password}
                  onChange={e => setCreateForm({...createForm, password: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Link Student</h2>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleLink} className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Link a student to <strong>{selectedParent?.name}</strong>. This will allow them to view the student's records.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Student</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={linkForm.student_id}
                  onChange={e => setLinkForm({...linkForm, student_id: e.target.value})}
                >
                  <option value="">Choose a student...</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Link Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
