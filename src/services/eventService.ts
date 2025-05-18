import { db } from "../firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { Event } from "../types/Event";

const eventsCol = collection(db, "events");

// Tarihe göre sıralı çekmek için orderBy ekledik
export const fetchEvents = async (): Promise<Event[]> => {
  const q = query(eventsCol, orderBy("date", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...(d.data() as Omit<Event, "id">),
  }));
};

export const addEvent = (ev: Omit<Event, "id">) => {
  return addDoc(eventsCol, ev);
};

export const updateEvent = (ev: Event) => {
  const ref = doc(db, "events", ev.id);
  return updateDoc(ref, {
    title: ev.title,
    date: ev.date,
    category: ev.category,
    city: ev.city,
    availableTickets: ev.availableTickets,
    price: ev.price,
  });
};

export const deleteEvent = (id: string) => {
  const ref = doc(db, "events", id);
  return deleteDoc(ref);
};
