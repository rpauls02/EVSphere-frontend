import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import BuyerSidebar from '../../BuyerContent/BuyerSidebar'
import SellerSidebar from '../../SellerContent/SellerSidebar'

const Messages: React.FC = () => {

    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserRole(userData.role || '');
                    } else {
                        console.error("Could not find user record.");
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                }
            }
        };

        fetchUserData();
    }, []);
    return (
        <div className="messages-page-container">
            <div className="sidebar-container">
                {userRole === 'buyer' && <BuyerSidebar />}
                {userRole === 'seller' && <SellerSidebar />}
            </div>
            <div className="page-title-container">
                <h1>Manage your Messages</h1>
            </div>
            
        </div>
    );
};

export default Messages;