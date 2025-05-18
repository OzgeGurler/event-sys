// src/context/AuthContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    approved: boolean;
    needsPasswordChange: boolean;
    /** Şifre değişikliği tamamlandığında bunu çağır */
    markPasswordChanged: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    approved: false,
    needsPasswordChange: false,
    markPasswordChanged: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [approved, setApproved] = useState(false);
    const [needsPasswordChange, setNeedsPasswordChange] = useState(false);

    // Bu fonksiyon ChangePasswordPage tarafından çağrılacak
    const markPasswordChanged = () => {
        setNeedsPasswordChange(false);
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);

            const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
            if (firebaseUser?.email === adminEmail) {
                setIsAdmin(true);
                setApproved(true);
                setNeedsPasswordChange(false);
            } else if (firebaseUser) {
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data() as {
                        approved: boolean;
                        passwordChanged: boolean;
                    };
                    setApproved(data.approved);
                    setNeedsPasswordChange(!data.passwordChanged);
                }
            } else {
                // Çıkış yapıldıysa sıfırla
                setIsAdmin(false);
                setApproved(false);
                setNeedsPasswordChange(false);
            }
        });
        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin,
                approved,
                needsPasswordChange,
                markPasswordChanged,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
