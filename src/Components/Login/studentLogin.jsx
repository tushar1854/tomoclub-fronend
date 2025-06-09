import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Saly from '../../assets/Saly.png';
import { ReactComponent as Tomoclub } from '../../assets/Tomoclub.svg';
import './login.css';
import Loader from '../Common/Loader/Loader';
import { callAPI } from '../../Helper';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolInput, setSchoolInput] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [studentIdDigits, setStudentIdDigits] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [isValidStudent, setIsValidStudent] = useState(null);
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const result = await callAPI(
          'get',
          'https://a17981geq2.execute-api.us-east-1.amazonaws.com/testing/get_all_school_list'
        );
        setSchools(result);
        setFilteredSchools(result);
      } catch (error) {
        console.error('Error fetching school list:', error);
      }
    }
    fetchSchools();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSchoolInputChange = (e) => {
    const value = e.target.value;
    setSchoolInput(value);
    const filtered = schools.filter((school) =>
      school.school_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSchools(filtered);
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSchoolInput(school.school_name);
    setFilteredSchools([]);
    setShowDropdown(false);
    // Reset other fields
    setStudentIdDigits('');
    setIsValidStudent(null);
    setPassword('');
    setStudentUsername('');
  };

  const validateStudentUsername = async () => {
    if (!selectedSchool || !studentIdDigits) return;
    const username = `${selectedSchool.abbreviation}${studentIdDigits}`;
    setStudentUsername(username);
    try {
      const result = await callAPI(
        'get',
        `https://my7uk7hjq9.execute-api.us-east-1.amazonaws.com/testing/check_student_username_is_valid_or_invalid?student_username=${username}`
      );
      setIsValidStudent(result.status === 1);
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidStudent(false);
    }
  };

  const handleConfirm = async () => {
    if (!isValidStudent || !password) return;
    setLoader(true);
    try {
        const apiUrl = `https://q06qudr6m4.execute-api.us-east-1.amazonaws.com/testing/student-login-new/?student_username=${studentUsername}&password=${password}`;
        const result = await callAPI('get', apiUrl);

        if (result && result.status === 1) {
        const user = {
            studentUsername: studentUsername,
            username: result.username,
            uid: result.uid,
            approved: result.approved,
            entity: result.entity,
            studentusernameprimarykey: result.studentusernameprimarykey,
        };

        sessionStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
        } else {
        alert('Invalid credentials');
        }
    } catch (error) {
        alert('Login failed');
        console.error('Login error:', error);
    } finally {
        setLoader(false);
    }
    };


  return loader ? (
    <Loader />
  ) : (
    <div className="container">
      <div className="leftBox newclass">
        <div className="leftText">
          <div className="logo">
            <Tomoclub />
          </div>
          <h1 className="leftHead">
            Most Engaging SEL <br /> Curriculum Ever
          </h1>
        </div>
        <div className="img">
          <img src={Saly} alt="Saly" />
        </div>
      </div>

      <div className="rightBox-student">
        <div className="box-student">
          <h2 className="headright">Login to your TomoClub Dashboard</h2>

          <div className="login-form">
            {/* School Input */}
            <div className="inline-field" ref={dropdownRef}>
              <label>Select your school:</label>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  value={schoolInput}
                  onChange={handleSchoolInputChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Type your school name"
                  className="school-input"
                />
                {showDropdown && filteredSchools.length > 0 && (
                  <ul className="dropdown">
                    {filteredSchools.map((school) => (
                      <li
                        key={school.uid}
                        onClick={() => handleSchoolSelect(school)}
                      >
                        {school.school_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* TomoClub ID input */}
            <div className="inline-field">
              <label>Enter your TomoClub ID:</label>
              <div className="id-input-group">
                <input
                  type="text"
                  value={selectedSchool ? selectedSchool.abbreviation : ''}
                  readOnly
                  className="id-prefix"
                />
                <input
                  type="text"
                  value={studentIdDigits}
                  onChange={(e) => setStudentIdDigits(e.target.value)}
                  className="id-suffix"
                  placeholder=""
                />
                <button className="search-btn" onClick={validateStudentUsername}>
                  🔍
                </button>
              </div>
            </div>

            {/* Password input */}
            {isValidStudent && (
              <div className="inline-field">
                <label>Enter your password:</label>
                <input
                  type="password"
                  value={password}
                  className="school-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {/* Error message */}
            {isValidStudent === false && (
              <span className="error-text">Student is not registered</span>
            )}

            {/* Confirm button */}
            <button
              className="btn"
              onClick={handleConfirm}
              disabled={!isValidStudent || !password}
            >
              Confirm
            </button>
          </div>

          {/* Help text */}
          <h4 className="suppText">
            If you can’t login, please ask your teacher for help.
          </h4>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
