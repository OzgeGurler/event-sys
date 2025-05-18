// src/seedEvents.ts
import { db } from "./firebase/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const sampleEvents = [
    {
        title: "Rock Konseri",
        date: "2025-06-01",
        category: "concert",
        city: "İstanbul",
        availableTickets: 50,
    },
    {
        title: "Spor Müsabakası",
        date: "2025-06-10",
        category: "sport",
        city: "Ankara",
        availableTickets: 30,
    },
    {
        title: "Yazılım Konferansı",
        date: "2025-07-05",
        category: "conference",
        city: "İzmir",
        availableTickets: 20,
    },
];

async function seed() {
    const colRef = collection(db, "events");
    for (const ev of sampleEvents) {
        await addDoc(colRef, ev);
        console.log("Added:", ev.title);
    }
    console.log("Seeding done");
}

seed();
