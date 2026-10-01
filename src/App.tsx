import React, { useState, useEffect } from 'react';
import {
  StudentRegistration,
  TestResult,
  AppSettings,
} from './types';
import {
  fetchAllTestResults,
  fetchAppSettings,
  saveTestResult,
  updateAppSettings,
  deleteTestResult,
  DEFAULT_SETTINGS,
} from './lib/firebase';
import { ASSESSMENT_QUESTIONS } from './data/questions';
import { computeAssessmentResult } from './data/talents';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StudentForm } from './components/StudentForm';
import { Orientation } from './components/Orientation';
import { AssessmentQuiz } from './components/AssessmentQuiz';
import { ResultView } from './components/ResultView';
import { AdminModal } from './components/AdminModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Compass, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<
    'landing' | 'orientation' | 'quiz' | 'result' | 'admin'
  >('landing');

  const [studentData, setStudentData] = useState<StudentRegistration | null>(null);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);

  // Settings & Database state
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Initialize data on boot
  useEffect(() => {
    async function initData() {
      try {
        const [loadedSettings, loadedResults] = await Promise.all([
          fetchAppSettings(),
          fetchAllTestResults(),
        ]);
        if (loadedSettings) setSettings(loadedSettings);
        if (loadedResults) setAllResults(loadedResults);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // Handlers for Student Flow
  const handleStudentFormSubmit = (data: StudentRegistration) => {
    setStudentData(data);
    setCurrentStep('orientation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizComplete = async (
    answers: { questionId: number; optionId: string }[]
  ) => {
    if (!studentData) return;

    setIsLoading(true);
    try {
      // Calculate assessment result using the combined 3 methodologies
      const generatedResult = computeAssessmentResult(
        studentData,
        answers,
        ASSESSMENT_QUESTIONS
      );

      // Save to Firestore & local cache
      await saveTestResult(generatedResult);

      // Update state
      setCurrentResult(generatedResult);
      setAllResults(prev => [generatedResult, ...prev]);
      setCurrentStep('result');
    } catch (err) {
      console.error('Error calculating/saving assessment:', err);
      alert('Terjadi kesalahan saat memproses hasil. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    setCurrentResult(null);
    setCurrentStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for Admin
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminModalOpen(false);
    setCurrentStep('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    if (currentStep === 'admin') {
      setCurrentStep('landing');
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updated = await updateAppSettings(newSettings);
      setSettings(updated);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handleDeleteResult = async (id: string) => {
    try {
      await deleteTestResult(id);
      setAllResults(prev => prev.filter(r => r.id !== id));
      if (currentResult?.id === id) {
        setCurrentResult(null);
      }
    } catch (err) {
      console.error('Failed to delete test result:', err);
    }
  };

  const handleRefreshData = async () => {
    try {
      const [refreshedSettings, refreshedResults] = await Promise.all([
        fetchAppSettings(),
        fetchAllTestResults(),
      ]);
      setSettings(refreshedSettings);
      setAllResults(refreshedResults);
    } catch (e) {
      console.error('Refresh error:', e);
    }
  };

  if (isLoading && !studentData && allResults.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center flex-col gap-4 text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 animate-spin">
          <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
            <Compass className="w-7 h-7 text-amber-400" />
          </div>
        </div>
        <div className="text-sm font-semibold tracking-wider text-purple-300 font-mono animate-pulse">
          MEMUAT G-COMPASS ENGINE...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setCurrentStep(currentStep === 'admin' ? 'landing' : 'admin');
          } else {
            setIsAdminModalOpen(true);
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleAdminLogout}
        currentStep={currentStep}
        onNavigateHome={() => setCurrentStep('landing')}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentStep === 'landing' && (
          <StudentForm
            settings={settings}
            onSubmit={handleStudentFormSubmit}
            initialData={studentData}
          />
        )}

        {currentStep === 'orientation' && studentData && (
          <Orientation
            student={studentData}
            settings={settings}
            onStartQuiz={handleStartQuiz}
            onBack={() => setCurrentStep('landing')}
          />
        )}

        {currentStep === 'quiz' && (
          <AssessmentQuiz
            questions={ASSESSMENT_QUESTIONS}
            onComplete={handleQuizComplete}
            onCancel={() => setCurrentStep('orientation')}
          />
        )}

        {currentStep === 'result' && currentResult && (
          <ResultView
            result={currentResult}
            settings={settings}
            onRetake={handleRetake}
          />
        )}

        {currentStep === 'admin' && isAdminLoggedIn && (
          <AdminDashboard
            results={allResults}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onDeleteResult={handleDeleteResult}
            onRefreshData={handleRefreshData}
            onClose={() => setCurrentStep('landing')}
          />
        )}
      </main>

      {/* Admin Authorization Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Global Footer (Contains Mandatory "Powered by Pak GuruAI") */}
      <Footer
        settings={settings}
        onAdminClick={() => {
          if (isAdminLoggedIn) {
            setCurrentStep('admin');
          } else {
            setIsAdminModalOpen(true);
          }
        }}
      />
    </div>
  );
}
