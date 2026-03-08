export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';
}

export interface Student {
  id: number;
  user_id: number;
  name: string;
  email: string;
  admission_no: string;
  class_id: number;
  section_id: number;
  class_name?: string;
  section_name?: string;
  dob: string;
  parent_name: string;
  parent_contact: string;
  address: string;
}

export interface Teacher {
  id: number;
  user_id: number;
  name: string;
  email: string;
  qualification: string;
  specialization: string;
  joining_date: string;
}

export interface Fee {
  id: number;
  student_id: number;
  student_name?: string;
  admission_no?: string;
  title: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'partial';
}

export interface Class {
  id: number;
  name: string;
}

export interface Section {
  id: number;
  name: string;
  class_id: number;
}
