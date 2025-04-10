import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './login/notFound';
import { LoginPage } from './login/login';
import { HomePage } from './home/home';
import StudyPlansPage from './pages/studyPlans';
import CreateStudyPlanPage from './pages/createdStudyPlans';
import StudyMaterialsPage from './pages/studyMaterialsPage';
import { MainLayout } from './pages/mainLayout';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/study-plans" element={<StudyPlansPage />} />
          <Route path="/study-plans/create" element={<CreateStudyPlanPage />} />
          <Route path="/study-materials" element={<StudyMaterialsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
