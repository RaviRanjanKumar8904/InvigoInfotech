import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKiW08fln68JUSTBL8ypx015IJy5XQ_ac",
  authDomain: "invigo-infotech-c24dc.firebaseapp.com",
  projectId: "invigo-infotech-c24dc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const beuColleges = [
  "Muzaffarpur Institute of Technology (MIT), Muzaffarpur",
  "Bhagalpur College of Engineering (BCE), Bhagalpur",
  "Bakhtiyarpur College of Engineering (BCE), Patna",
  "Gaya College of Engineering (GCE), Gaya",
  "Nalanda College of Engineering (NCE), Chandi",
  "Darbhanga College of Engineering (DCE), Darbhanga",
  "Motihari College of Engineering (MCE), Motihari",
  "Loknayak Jai Prakash Institute of Technology (LNJPIT), Chapra",
  "B.P. Mandal College of Engineering, Madhepura",
  "Supaul College of Engineering, Supaul",
  "Saharsa College of Engineering, Saharsa",
  "Shershah Engineering College, Sasaram",
  "Purnea College of Engineering, Purnea",
  "Rashtrakavi Ramdhari Singh Dinkar College of Engineering, Begusarai",
  "Government Engineering College, Arwal",
  "Government Engineering College, Aurangabad",
  "Government Engineering College, Jamui",
  "Government Engineering College, Katihar",
  "Government Engineering College, Khagaria",
  "Government Engineering College, Kishanganj",
  "Government Engineering College, Lakhisarai",
  "Government Engineering College, Madhubani",
  "Government Engineering College, Munger",
  "Government Engineering College, Nawada",
  "Government Engineering College, Samastipur",
  "Government Engineering College, Sheikhpura",
  "Government Engineering College, Sheohar",
  "Government Engineering College, Siwan",
  "Government Engineering College, Sitamarhi",
  "Government Engineering College, Vaishali",
  "Government Engineering College, West Champaran",
  "Netaji Subhas Institute of Technology (NSIT), Bihta/Patna",
  "R.P. Sharma Institute of Technology, Patna",
  "Moti Babu Institute of Technology, Forbesganj",
  "Vidya Vihar Institute of Technology, Purnia",
  "K.K. College of Engineering & Management, Biharsharif",
  "Maulana Azad College of Engineering and Technology, Patna",
  "Sityog Institute of Technology, Aurangabad",
  "Buddha Institute of Technology, Gaya"
];

async function seed() {
  for (const name of beuColleges) {
    try {
      await addDoc(collection(db, 'partnerColleges'), {
        collegeName: name,
        coordinatorName: "BEU Coordinator",
        coordinatorPhone: "",
        coordinatorEmail: "",
        createdAt: new Date().toISOString()
      });
      console.log("Added " + name);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done");
  process.exit(0);
}

seed();
