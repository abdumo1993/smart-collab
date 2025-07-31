import { useEffect, useState } from "react";
import Main from "@components/ui/EditorComponent";
import { QDelta } from "@lib/business-logic/Q-CRDT/interfaces";
import { Route, Routes } from "react-router-dom";
import LandingPage from "@pages/LandingPage";
import EditorPage from "@pages/editor/page";
import AuthPage from "@pages/auth/auth";
import Dashboard from "@pages/dashboard/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor/:docId" element={<EditorPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );

  
    // return (
    //   <div className="text-4xl text-blue-600 font-bold p-4">
    //     ✅ Tailwind is working!
    //   </div>
    // );
  
  
}
