import './page.module.css'
import AdminPageContent from "@/app/admin/adminPageContent";
import {ToastContainer} from "react-toastify";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {signOut} from "next-auth/react";


export default async function Admin() {
    const session = await getServerSession();
    if(!session) {
        redirect("/")
    }
    if (session && session.user.image !== "ADMIN") {
        redirect("/")
    }
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