import { useEffect, useState } from 'react';
import { Plus, Trash2, Shield, Calendar, Layers, Building, Coffee } from 'lucide-react';
import { clsx } from 'clsx';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'academic' | 'classes' | 'holidays'>('general');
  const [users, setUsers] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [schoolSettings, setSchoolSettings] = useState({
    school_name: '',
    school_address: '',
    school_phone: '',
    school_email: '',
    school_logo: ''
  });
  
  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [yearForm, setYearForm] = useState({ name: '', start_date: '', end_date: '', is_active: false });
  const [classForm, setClassForm] = useState({ name: '' });
  const [sectionForm, setSectionForm] = useState({ name: '', class_id: '' });
  const [holidayForm, setHolidayForm] = useState({ name: '', start_date: '', end_date: '', description: '' });

  useEffect(() => {
    fetchUsers();
    fetchAcademicYears();
    fetchClasses();
    fetchHolidays();
    fetchSchoolSettings();
  }, []);

  const fetchUsers = () => fetch('/api/settings/users').then(r => r.json()).then(setUsers);
  const fetchAcademicYears = () => fetch('/api/settings/academic-years').then(r => r.json()).then(setAcademicYears);
  const fetchClasses = () => fetch('/api/classes').then(r => r.json()).then(data => {
    setClasses(data.classes);
    setSections(data.sections);
  });
  const fetchHolidays = () => fetch('/api/settings/holidays').then(r => r.json()).then(setHolidays);
  const fetchSchoolSettings = () => fetch('/api/settings/school').then(r => r.json()).then(setSchoolSettings);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    });
    fetchUsers();
    setUserForm({ name: '', email: '', password: '', role: 'admin' });
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings/academic-years', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yearForm)
    });
    fetchAcademicYears();
    setYearForm({ name: '', start_date: '', end_date: '', is_active: false });
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classForm)
    });
    fetchClasses();
    setClassForm({ name: '' });
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionForm)
    });
    fetchClasses();
    setSectionForm({ name: '', class_id: '' });
  };

  const handleUpdateSchoolSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings/school', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schoolSettings)
    });
    alert('School settings updated successfully!');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const formData = new FormData();
    formData.append('logo', e.target.files[0]);

    try {
      const res = await fetch('/api/settings/school/logo', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSchoolSettings(prev => ({ ...prev, school_logo: data.logoUrl }));
        alert('Logo updated successfully!');
      }
    } catch (error) {
      console.error('Failed to upload logo', error);
    }
  };

  const handleCreateHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holidayForm)
    });
    fetchHolidays();
    setHolidayForm({ name: '', start_date: '', end_date: '', description: '' });
  };

  const handleDeleteHoliday = async (id: number) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      await fetch(`/api/settings/holidays/${id}`, { method: 'DELETE' });
      fetchHolidays();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500">Manage users, academic years, classes, and school profile</p>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
        {[
          { id: 'general', label: 'General', icon: Building },
          { id: 'users', label: 'Users', icon: Shield },
          { id: 'academic', label: 'Academic', icon: Calendar },
          { id: 'classes', label: 'Classes', icon: Layers },
          { id: 'holidays', label: 'Holidays', icon: Coffee },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
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

      {activeTab === 'general' && (
        <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-6">School Branding & Contact</h3>
          <form onSubmit={handleUpdateSchoolSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={schoolSettings.school_name}
                onChange={e => setSchoolSettings({...schoolSettings, school_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={schoolSettings.school_address || ''}
                onChange={e => setSchoolSettings({...schoolSettings, school_address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={schoolSettings.school_phone || ''}
                  onChange={e => setSchoolSettings({...schoolSettings, school_phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={schoolSettings.school_email || ''}
                  onChange={e => setSchoolSettings({...schoolSettings, school_email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School Logo</label>
              <div className="flex items-center gap-4">
                {schoolSettings.school_logo && (
                  <img src={schoolSettings.school_logo} alt="School Logo" className="h-16 w-16 object-contain border rounded-lg bg-slate-50" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                  "
                />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">System Administrators & Staff</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-3 capitalize">{user.role}</td>
                    <td className="px-6 py-3 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h3 className="font-semibold text-slate-900 mb-4">Add New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userForm.name}
                  onChange={e => setUserForm({...userForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userForm.email}
                  onChange={e => setUserForm({...userForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  required
                  type="password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userForm.password}
                  onChange={e => setUserForm({...userForm, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userForm.role}
                  onChange={e => setUserForm({...userForm, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="accountant">Accountant</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Academic Years</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {academicYears.map((year) => (
                  <tr key={year.id}>
                    <td className="px-6 py-3 font-medium text-slate-900">{year.name}</td>
                    <td className="px-6 py-3 text-slate-500">{year.start_date}</td>
                    <td className="px-6 py-3 text-slate-500">{year.end_date}</td>
                    <td className="px-6 py-3">
                      {year.is_active ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Active</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h3 className="font-semibold text-slate-900 mb-4">Add Academic Year</h3>
            <form onSubmit={handleCreateYear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  required
                  placeholder="e.g. 2023-2024"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={yearForm.name}
                  onChange={e => setYearForm({...yearForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={yearForm.start_date}
                  onChange={e => setYearForm({...yearForm, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={yearForm.end_date}
                  onChange={e => setYearForm({...yearForm, end_date: e.target.value})}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  className="mr-2"
                  checked={yearForm.is_active}
                  onChange={e => setYearForm({...yearForm, is_active: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">Set as Active Year</label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Create Year
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Classes</h3>
            <div className="space-y-4 mb-6">
              {classes.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-slate-500">
                    {sections.filter(s => s.class_id === c.id).length} Sections
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleCreateClass} className="flex gap-2">
              <input
                required
                placeholder="New Class Name"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={classForm.name}
                onChange={e => setClassForm({...classForm, name: e.target.value})}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Sections</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {sections.map(s => {
                const className = classes.find(c => c.id === s.class_id)?.name;
                return (
                  <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-slate-500">{className}</span>
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleCreateSection} className="space-y-2">
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={sectionForm.class_id}
                onChange={e => setSectionForm({...sectionForm, class_id: e.target.value})}
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  required
                  placeholder="Section Name (e.g. A)"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={sectionForm.name}
                  onChange={e => setSectionForm({...sectionForm, name: e.target.value})}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">School Holidays</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Holiday Name</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {holidays.map((holiday) => (
                  <tr key={holiday.id}>
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-900">{holiday.name}</div>
                      <div className="text-slate-500 text-xs">{holiday.description}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{new Date(holiday.start_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-slate-500">{new Date(holiday.end_date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No holidays added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h3 className="font-semibold text-slate-900 mb-4">Add Holiday</h3>
            <form onSubmit={handleCreateHoliday} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Holiday Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={holidayForm.name}
                  onChange={e => setHolidayForm({...holidayForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={holidayForm.start_date}
                  onChange={e => setHolidayForm({...holidayForm, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={holidayForm.end_date}
                  onChange={e => setHolidayForm({...holidayForm, end_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={holidayForm.description}
                  onChange={e => setHolidayForm({...holidayForm, description: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Add Holiday
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
