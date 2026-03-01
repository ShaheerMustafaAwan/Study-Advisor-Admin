import { create } from "zustand";

/* ================= TYPES ================= */

export type Student = {
  id: number;
  name: string;
  program: string;
  location: string;
  date: string;
  assigned: string | null;
};

export type Counselor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  capacity: number;
  skills: string[];
  joined: string;
};

export type University = {
  id: number;
  name: string;
  ranking: number;
  country: string;
  city: string;
  tuitionFee: number;
  applicationFee: number;
  minGpa: number;
  minIelts: number;
  website: string;
  programs: string[];
  description: string;
};

export type Activity = {
  id: number;
  type: "Student" | "Counselor" | "University" | "System" | "Document";
  message: string;
  time: string;
};

type AdminStore = {
  students: Student[];
  counselors: Counselor[];
  universities: University[];
  activities: Activity[];

  addActivity: (activity: Omit<Activity, "id">) => void;

  addCounselor: (counselor: Counselor) => void;
  updateCounselor: (id: number, data: Partial<Counselor>) => void;
  deleteCounselor: (id: number) => void;

  assignStudent: (studentId: number, counselorName: string) => void;

  addUniversity: (uni: University) => void;
  updateUniversity: (uni: University) => void;
  deleteUniversity: (id: number) => void;
};

/* ================= STORE ================= */

export const useAdminStore = create<AdminStore>((set, get) => ({
  /* ---------- STUDENTS ---------- */

  students: [
    {
      id: 1,
      name: "John Smith",
      program: "Computer Science",
      location: "New York",
      date: "2024-01-16",
      assigned: null,
    },
    {
      id: 2,
      name: "Maria Garcia",
      program: "Business",
      location: "Madrid",
      date: "2024-01-15",
      assigned: "Sarah Miller",
    },
  ],

  /* ---------- COUNSELORS ---------- */

  counselors: [
    {
      id: 1,
      name: "Sarah Miller",
      email: "sarah.miller@company.com",
      phone: "+1-555-0101",
      capacity: 20,
      skills: ["Computer Science", "Engineering"],
      joined: "2023-08-15",
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike@gmail.com",
      phone: "+1-555-0101",
      capacity: 20,
      skills: ["Business", "Medicine"],
      joined: "2023-09-01",
    },
  ],

  /* ---------- UNIVERSITIES ---------- */

  universities: [
    {
      id: 1,
      name: "University of Toronto",
      ranking: 18,
      country: "Canada",
      city: "Toronto",
      tuitionFee: 45000,
      applicationFee: 150,
      minGpa: 3.5,
      minIelts: 7.0,
      website: "https://www.utoronto.ca",
      programs: ["Computer Science", "Business", "Engineering"],
      description: "Leading Canadian research university known for innovation.",
    },
  ],

  /* ---------- ACTIVITIES ---------- */

  activities: [
    {
      id: 1,
      type: "System",
      message: "Admin dashboard initialized",
      time: "Just now",
    },
  ],

  addActivity: (activity) =>
    set((state) => ({
      activities: [{ id: Date.now(), ...activity }, ...state.activities],
    })),

  /* ---------- COUNSELOR ACTIONS ---------- */

  addCounselor: (counselor) => {
    set((state) => ({
      counselors: [...state.counselors, counselor],
    }));

    get().addActivity({
      type: "Counselor",
      message: `${counselor.name} was added as a counselor`,
      time: "Just now",
    });
  },

  updateCounselor: (id, data) => {
    set((state) => ({
      counselors: state.counselors.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      ),
    }));

    get().addActivity({
      type: "Counselor",
      message: `Counselor profile updated`,
      time: "Just now",
    });
  },

  deleteCounselor: (id) => {
    const counselor = get().counselors.find((c) => c.id === id);

    set((state) => ({
      counselors: state.counselors.filter((c) => c.id !== id),
    }));

    if (counselor) {
      get().addActivity({
        type: "Counselor",
        message: `${counselor.name} was removed`,
        time: "Just now",
      });
    }
  },

  /* ---------- STUDENT ACTIONS ---------- */

  assignStudent: (studentId, counselorName) => {
    const student = get().students.find((s) => s.id === studentId);

    set((state) => ({
      students: state.students.map((student) =>
        student.id === studentId
          ? { ...student, assigned: counselorName }
          : student,
      ),
    }));

    if (student) {
      get().addActivity({
        type: "Student",
        message: `${student.name} assigned to ${counselorName}`,
        time: "Just now",
      });
    }
  },

  /* ---------- UNIVERSITY ACTIONS ---------- */

  addUniversity: (uni) => {
    set((state) => ({
      universities: [...state.universities, uni],
    }));

    get().addActivity({
      type: "University",
      message: `${uni.name} partnership added`,
      time: "Just now",
    });
  },

  updateUniversity: (updatedUni) => {
    set((state) => ({
      universities: state.universities.map((u) =>
        u.id === updatedUni.id ? updatedUni : u,
      ),
    }));

    get().addActivity({
      type: "University",
      message: `${updatedUni.name} details updated`,
      time: "Just now",
    });
  },

  deleteUniversity: (id) => {
    const uni = get().universities.find((u) => u.id === id);

    set((state) => ({
      universities: state.universities.filter((u) => u.id !== id),
    }));

    if (uni) {
      get().addActivity({
        type: "University",
        message: `${uni.name} partnership removed`,
        time: "Just now",
      });
    }
  },
}));
