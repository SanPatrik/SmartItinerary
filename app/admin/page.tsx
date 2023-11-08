"use client";

import './page.module.css'
import AdminPageContent from "@/app/admin/adminPageContent";
import {ToastContainer} from "react-toastify";

export default function Admin() {
    return (
        <>
            <AdminPageContent />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );

}