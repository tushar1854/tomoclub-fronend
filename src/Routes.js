import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './Components/Login/Login';
const Home = React.lazy(() => import('./Components/Home/Home'));
import { AuthContextProvider } from './Context/AuthContext';
import AddSchool from './Components/Accounts/AddSchool/AddSchool';
import SucessPage from './Components/Common/SucessPage/SucessPage';

import Navbar from './Components/Common/Navbar/Navbar';
import Header from './Components/Common/Header/Header';
import Accounts from './Components/Accounts/Accounts';
import Loader from './Components/Common/Loader/Loader';
import AddTeacher from './Components/Accounts/AddTeacher/AddTeacher';
import AddStudent from './Components/Accounts/AddStudent/AddStudent';
import AddDistrictAdmin from './Components/Accounts/AddDistrictAdmin/AddDistrictAdmin';
import Schools from './Components/Schools/Schools';
import AddSchools from './Components/Accounts/AddSchools/AddSchools';
import School from './Components/Schools/School/School';
import Students from './Components/Students/Students';
import Student from './Components/Students/Student/Student';
// Teachers
import Teachers from './Components/Teachers/Teachers';
import Teacher from './Components/Teachers/Teacher/Teacher';
import Cohorts from './Components/Cohorts/Cohorts';
import CreateCohort from './Components/Cohorts/CreateCohort/CreateCohort';
import Accordian from './Components/Common/Accordian/Accordian';
import Curriculum from './Components/Curriculum/Curriculum';
import AddCurriculum from './Components/Curriculum/AddCurriculum';
import CreateCurriculum from './Components/Curriculum/CreateCurriculum';
import EditCurriculum from './Components/Curriculum/EditCurriculum';
import EditCurriculumAddSession from './Components/Curriculum/EditCurriculumAddSession';
import EditCohort from './Components/Cohorts/EditCohort/EditCohort';
import Library from './Components/Library/Library';
import AddLibrary from './Components/Library/AddLibrary/AddLibrary';
import EditLibrary from './Components/Library/EditLibrary/EditLibrary';
import GenerateSessions from './Components/Sessions/GenerateSessions/GenerateSessions';
import Session from './Components/Sessions/Session';
import AddSession from './Components/Sessions/AddSession/AddSession';
import AddSingleSession from './Components/Sessions/AddSingleSession/AddSingleSession';
import EditSingleSession from './Components/Sessions/Edit/EditSingleSession';
import CohortLast4 from './Components/Cohorts/Cohort/CohortLast4';
import CohortAllSession from './Components/Cohorts/Cohort/CohortAllSession';
import StudentEval from './Components/Students/Student/StudentEval';
import StudentSession from './Components/Students/Student/StudentSession';
import Scheduler from './Components/Common/Calender/Scheduler';
import ModeratorHome from './Components/Moderator/ModeratorHome';
import ModeratorDetail from './Components/Moderator/ModeratorDetail/ModeratorDetail';
import ModSession from './Components/Moderator/ModSession/ModSession';
import AddModerator from './Components/Moderator/AddModerator/AddModerator';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { getSessionStorage } from './Helper';

const App = () => {
  const user = JSON.parse(getSessionStorage('user'));
  return (
    <AuthContextProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration/addschool" element={<AddSchool />} />
          <Route path="/sucesspage" element={<SucessPage />} />
          {/* <Route path="/accounts" element={<Notification />} /> */}
          <Route
            path="/home"
            element={
              // <ProtectedRoute entity={user?.entity}>
              <>
                <Navbar />
                <Header />
                <Home />
              </>
              // </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <Accounts />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/addteacher"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddTeacher />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/addstudent"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddStudent />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/adddistrictadmin"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddDistrictAdmin />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/addschool"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddSchools />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <Schools />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/:school"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <School />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <Students />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:student"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <Student />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <Teachers />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers/:teacher"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <Teacher />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/session/:student"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <StudentSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/eval/:student"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <StudentEval />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cohorts"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <Cohorts />
                </>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/cohorts/:cohorts"
            element={
              <ProtectedRoute>
              <>
                <Navbar />
                <Header />
                <Cohort />
              </>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/cohorts/createcohort"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <CreateCohort />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cohorts/editcohort"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <EditCohort />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accordian"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <Accordian />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <Curriculum />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum/add"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddCurriculum />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum/create"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <CreateCurriculum />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum/edit"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculum />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum/edit/addsession"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <Library />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/add"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddLibrary />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/edit"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <EditLibrary />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <Session />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/generate"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <GenerateSessions />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/add"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <AddSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/singlesession"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <AddSingleSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/edit"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditSingleSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cohorts/:cohortUid"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <CohortLast4 />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cohorts/all/:cohortUid"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <CohortAllSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calender"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <Scheduler />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderators"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <ModeratorHome />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/modview/:modName"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <ModeratorDetail />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderators/session"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <ModSession />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderators/add"
            element={
              <ProtectedRoute entity={user?.entity}>
                <>
                  <Navbar />
                  <Header />
                  <EditCurriculumAddSession />
                  <AddModerator />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AuthContextProvider>
  );
};

export default App;
