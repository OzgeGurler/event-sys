import { db } from "../firebase/FirebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import { Announcement } from "../types/Announcement";

const annCol = collection(db, "announcements");

// Tarihe göre en yeni önce
export const fetchAnnouncements = async (): Promise<Announcement[]> => {
    const q = query(annCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Announcement, "id">),
    }));
};

export const addAnnouncement = (message: string) => {
    return addDoc(annCol, {
        message,
        createdAt: new Date().toISOString(),
    });
};

export const deleteAnnouncement = (id: string) => {
    return deleteDoc(doc(db, "announcements", id));
};
