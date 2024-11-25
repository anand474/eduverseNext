import React, { useEffect, useState } from 'react';
import styles from '@/styles/BuildYourResume.module.css';
import Header from '@/components/Header';
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

export default function BuildYourResume() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    emailId: '',
    phoneNo: '',
    education: [],
    experience: [],
    certifications: [],
    skills: [],
    projects: [],
    interests: '',
    strengths: '',
    weaknesses: '',
    summary: '',
    isEditing: false,
    editIndex: null,
  });
  const [resumes, setResumes] = useState([]);
  const [loggedUserId, setUserId] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      alert("Please login to continue");
      window.location.href = "/login";
    } else {
      const loggedUserId = sessionStorage.getItem("userId");
      setUserId(loggedUserId);

      const fetchData = async () => {
        const fetchedResumes = await fetchResumes(loggedUserId);
        setResumes(fetchedResumes);
      };

      fetchData();
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addEducationField = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [...prevData.education, { university: '', degree: '', major: '', gpa: '', fromYear: '', toYear: '' }],
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      education: newEducation,
    }));
  };

  const deleteEducationField = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      education: newEducation,
    }));
  };

  const addExperienceField = () => {
    setFormData((prevData) => ({
      ...prevData,
      experience: [...prevData.experience, { jobTitle: '', company: '', fromYear: '', toYear: '', description: '' }],
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...formData.experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      experience: newExperience,
    }));
  };

  const deleteExperienceField = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      experience: newExperience,
    }));
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      projects: newProjects,
    }));
  };

  const deleteProjectField = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      projects: newProjects,
    }));
  };

  const addProjectField = () => {
    setFormData((prevData) => ({
      ...prevData,
      projects: [...prevData.projects, { projectTitle: '', projectDescription: '', projectFromYear: '', projectToYear: '' }],
    }));
  };

  const addCertificationField = () => {
    setFormData((prevData) => ({
      ...prevData,
      certifications: [...prevData.certifications, { title: '', issuer: '', date: '' }],
    }));
  };

  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    const newCertifications = [...formData.certifications];
    newCertifications[index] = { ...newCertifications[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      certifications: newCertifications,
    }));
  };

  const deleteCertificationField = (index) => {
    const newCertifications = formData.certifications.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      certifications: newCertifications,
    }));
  };

  const addSkillField = () => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, ''],
    }));
  };

  const handleSkillsChange = (index, e) => {
    const newSkills = [...formData.skills];
    newSkills[index] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      skills: newSkills,
    }));
  };

  const deleteSkillField = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      skills: newSkills,
    }));
  };

  const handleEditResume = (index) => {
    setFormData({ ...resumes[index], isEditing: true, editIndex: index });
    setCurrentStep(1);
    setShowForm(true);
  }

  const nextStep = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.emailId || !formData.phoneNo || !formData.summary) {
      alert("Please enter all the details to move forward.");
      return;
    }
    if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.emailId))) {
      alert("Enter a valid email.");
      return;
    }
    if (!(/^[0-9]{10}$/.test(formData.phoneNo))) {
      alert("Enter a valid phone number.");
      return;
    }
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fetchResumes = async (userId) => {
    console.log("fetchResumes...", userId);
    try {
      const response = await fetch(`/api/resumes?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log("fetchResumes... DONE", data);

        const updatedResumes = data.map((resume) => ({
          ...resume,
          education: resume.education ? JSON.parse(resume.education) : null,
          experience: resume.experience ? JSON.parse(resume.experience) : null,
          projects: resume.projects ? JSON.parse(resume.projects) : null,
          certifications: resume.certifications ? JSON.parse(resume.certifications) : null,
          skills: resume.skills ? JSON.parse(resume.skills) : null
        }));

        return updatedResumes;
      } else {
        console.error("Failed to fetch resumes");
        return [];
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      return [];
    }
  };

  const createResume = async (resumeData) => {
    try {
      console.log(resumeData);
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Resume created successfully:", data);
        fetchResumes(resumeData.uId);
      } else {
        const errorData = await response.json();
        console.error("Error creating resume:", errorData.error);
      }
    } catch (error) {
      console.error("Error creating resume:", error);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const response = await fetch(`/api/resumes?rId=${resumeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Resume deleted successfully:", data);
        const updatedResumes = await fetchResumes(loggedUserId);
        setResumes(updatedResumes);
      } else {
        const errorData = await response.json();
        console.error("Error deleting resume:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleDeleteResume = (indexToDelete) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this resume?");
    if (isConfirmed) {
      setResumes((prevResumes) =>
        prevResumes.filter((_, index) => index !== indexToDelete)
      );
      deleteResume(indexToDelete);
    }
  };

  const updateResume = async (resumeId, updatedData) => {
    console.log("updateResume...", resumeId, updatedData);
    try {
      const response = await fetch(`/api/resumes?rId=${resumeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedResumes = await fetchResumes(updatedData.uId);
        setResumes(updatedResumes);
        console.log("Resume updated successfully:", data);
      } else {
        const errorData = await response.json();
        console.error("Error updating resume:", errorData.error);
      }
    } catch (error) {
      console.error("Error updating resume:", error);
    }
  };

  const handleCreateResume = (e) => {
    e.preventDefault();

    const form = e.target;

    if (!form.reportValidity()) {
      return;
    }
    if (formData.education.length === 0 && formData.experience.length === 0 && formData.certifications.length === 0) {
      alert("Please add at least one education, experience, or certification.");
      return;
    }

    const newResume = {
      ...formData,
      creationDate: new Date().toLocaleString()
    };

    if (formData.isEditing) {
      setResumes((prevResumes) =>
        prevResumes.map((resume, index) =>
          index === formData.editIndex ? { ...resume, ...newResume } : resume
        )
      );
      updateResume(formData.editIndex, formData);
    } else {
      setResumes((prevResumes) => [newResume, ...prevResumes]);
      createResume({ uId: loggedUserId, ...newResume });
    }

    setShowForm(false);
    setFormData({
      name: "",
      emailId: "",
      phoneNo: "",
      education: [],
      experience: [],
      certifications: [],
      projects: [],
      skills: [],
      interests: "",
      strengths: "",
      weaknesses: "",
      summary: "",
      isEditing: false,
      editIndex: null,
    });
  };

  const downloadResume = (resume) => {
    const doc = new Document({
      creator: "Your Name",
      title: "Resume",
      description: `Resume of ${resume.name}`,
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              color: "2E86C1",
              size: 28,
            },
            paragraph: {
              spacing: { after: 200 },
            },
          },
          {
            id: "NormalText",
            name: "Normal Text",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              color: "000000",
              size: 24,
            },
            paragraph: {
              spacing: { after: 100 },
            },
          },
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              size: 36,
              color: "2C3E50",
            },
            paragraph: {
              alignment: "center",
              spacing: { after: 300 },
            },
          },
        ],
      },
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: resume.name,
              style: "Title",
            }),
            new Paragraph({
              text: resume.emailId,
              style: "NormalText",
              alignment: "center",
            }),
            new Paragraph({
              text: resume.phoneNo,
              style: "NormalText",
              alignment: "center",
            }),
            new Paragraph({
              text: resume.summary,
              style: "NormalText",
              spacing: { after: 300 },
            }),
  
            new Paragraph({
              text: "Education",
              style: "Heading1",
            }),
            ...resume.education.map((edu) =>
              new Paragraph({
                text: `${edu.degree} in ${edu.major}, ${edu.university} (${edu.fromYear} - ${edu.toYear})`,
                style: "NormalText",
              })
            ),
  
            new Paragraph({
              text: "Experience",
              style: "Heading1",
            }),
            ...resume.experience.map((exp) =>
              new Paragraph({
                text: `${exp.jobTitle} at ${exp.company} (${exp.fromYear} - ${exp.toYear}): ${exp.description}`,
                style: "NormalText",
              })
            ),
  
            new Paragraph({
              text: "Certifications",
              style: "Heading1",
            }),
            ...resume.certifications.map((cert) =>
              new Paragraph({
                text: `${cert.title}, Issued by ${cert.issuer} on ${new Date(cert.date).toDateString()}`,
                style: "NormalText",
              })
            ),
  
            new Paragraph({
              text: "Skills",
              style: "Heading1",
            }),
            new Paragraph({
              text: resume.skills.join(", "),
              style: "NormalText",
            }),
  
            new Paragraph({
              text: "Interests",
              style: "Heading1",
            }),
            new Paragraph({
              text: resume.interests,
              style: "NormalText",
            }),
  
            new Paragraph({
              text: "Strengths",
              style: "Heading1",
            }),
            new Paragraph({
              text: resume.strengths,
              style: "NormalText",
            }),
  
            new Paragraph({
              text: "Weaknesses",
              style: "Heading1",
            }),
            new Paragraph({
              text: resume.weaknesses,
              style: "NormalText",
            }),
          ],
        },
      ],
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${resume.name}_resume.docx`);
    });

    alert("Your resume is downloaded. Feel free to edit further as per your specifications.")
  };
  
  return (
    <>
      <Header />
      <div className={styles.buildResumePage}>
        <h1 className='pageTitle'>Build Your Resume</h1>

        <button className={styles.createResumeButton} onClick={() => {
          setShowForm(true);
          setCurrentStep(0);
          setFormData({
            name: "",
            emailId: "",
            phoneNo: "",
            education: [],
            experience: [],
            certifications: [],
            projects: [],
            skills: [],
            interests: "",
            strengths: "",
            weaknesses: "",
            summary: "",
          });
        }}>
          Create New Resume
        </button>

        {showForm && (
          <div className={styles.resumeFormOverlay}>
            <div className={styles.resumeFormPopup}>
              <div className={styles.resumeFormPopupHeader}>
                <h2>Create New Resume</h2>
                <span className={styles.resumeCloseIcon} onClick={() => setShowForm(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </div>

              <form className={styles.resumeForm} onSubmit={handleCreateResume}>
                {currentStep === 0 && (
                  <>
                    <label className={styles.formLabel}>
                      Name:
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label className={styles.formLabel}>
                      Email:
                      <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label className={styles.formLabel}>
                      Phone:
                      <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label className={styles.formLabel}>
                      Summary:
                      <textarea className={styles.textarea}
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <h3>Education</h3>
                    {formData.education.map((edu, index) => (
                      <div key={index} className={styles.resumeFormEntry}>
                        <input
                          type="text"
                          name="university"
                          value={edu.university}
                          placeholder="University"
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          placeholder="Degree"
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="major"
                          value={edu.major}
                          placeholder="Major"
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="gpa"
                          value={edu.gpa}
                          placeholder="GPA"
                          onChange={(e) => handleEducationChange(index, e)}
                        />
                        <input
                          type="text"
                          name="fromYear"
                          value={edu.fromYear}
                          placeholder="From Year"
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="toYear"
                          value={edu.toYear}
                          placeholder="To Year"
                          onChange={(e) => handleEducationChange(index, e)}
                          required
                        />
                        <button type="button" style={{ backgroundColor: 'lightcoral' }} className={styles.resumeFormButton} onClick={() => deleteEducationField(index+1)}>Delete</button>
                      </div>
                    ))}
                    <button type="button" className={styles.resumeFormButton} onClick={addEducationField}>Add Education</button>

                    <h3>Experience</h3>
                    {formData.experience.map((exp, index) => (
                      <div key={index} className={styles.resumeFormEntry}>
                        <input
                          type="text"
                          name="jobTitle"
                          value={exp.jobTitle}
                          placeholder="Job Title"
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="company"
                          value={exp.company}
                          placeholder="Company"
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="fromYear"
                          value={exp.fromYear}
                          placeholder="From Year"
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="toYear"
                          value={exp.toYear}
                          placeholder="To Year"
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <textarea className={styles.textarea}
                          name="description"
                          value={exp.description}
                          placeholder="Description"
                          onChange={(e) => handleExperienceChange(index, e)}
                          required
                        />
                        <button type="button" style={{ backgroundColor: 'lightcoral' }} className={styles.resumeFormButton} onClick={() => deleteExperienceField(index)}>Delete</button>
                      </div>
                    ))}
                    <button type="button" className={styles.resumeFormButton} onClick={addExperienceField}>Add Experience</button>

                    <h3>Projects</h3>
                    {formData.projects.map((project, index) => (
                      <div key={index} className={styles.resumeFormEntry}>
                        <input
                          type="text"
                          name="projectTitle"
                          value={project.projectTitle}
                          placeholder="Job Title"
                          onChange={(e) => handleProjectChange(index, e)}
                          required
                        />
                        <textarea className={styles.textarea}
                          name="projectDescription"
                          value={project.projectDescription}
                          placeholder="Description"
                          onChange={(e) => handleProjectChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="projectFromYear"
                          value={project.projectFromYear}
                          placeholder="From Year"
                          onChange={(e) => handleProjectChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="projectToYear"
                          value={project.projectToYear}
                          placeholder="To Year"
                          onChange={(e) => handleProjectChange(index, e)}
                          required
                        />
                        <button type="button" style={{ backgroundColor: 'lightcoral' }} className={styles.resumeFormButton} onClick={() => deleteProjectField(index)}>Delete</button>
                      </div>
                    ))}
                    <button type="button" className={styles.resumeFormButton} onClick={addProjectField}>Add Project</button>

                    <h3>Certifications</h3>
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className={styles.resumeFormEntry}>
                        <input
                          type="text"
                          name="title"
                          value={cert.title}
                          placeholder="Certification Title"
                          onChange={(e) => handleCertificationChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="issuer"
                          value={cert.issuer}
                          placeholder="Issuer"
                          onChange={(e) => handleCertificationChange(index, e)}
                          required
                        />
                        <input
                          type="text"
                          name="date"
                          value={cert.date}
                          placeholder="Date Obtained"
                          onChange={(e) => handleCertificationChange(index, e)}
                          required
                        />
                        <button type="button" style={{ backgroundColor: 'lightcoral' }} className={styles.resumeFormButton} onClick={() => deleteCertificationField(index)}>Delete</button>
                      </div>
                    ))}
                    <button type="button" className={styles.resumeFormButton} onClick={addCertificationField}>Add Certification</button>

                    <h3>Skills</h3>
                    {formData.skills.map((skill, index) => (
                      <div key={index} className={styles.resumeFormEntry}>
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillsChange(index, e)}
                          placeholder="Skill"
                          required
                        />
                        <button type="button" style={{ backgroundColor: 'lightcoral' }} className={styles.resumeFormButton} onClick={() => deleteSkillField(index)}>Delete</button>
                      </div>
                    ))}
                    <button type="button" className={styles.resumeFormButton} onClick={addSkillField}>Add Skill</button>

                    <label className={styles.formLabel}>
                      Interests:
                      <textarea className={styles.textarea}
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                      />
                    </label>
                    <label className={styles.formLabel}>
                      Strengths:
                      <input
                        type="text"
                        name="strengths"
                        value={formData.strengths}
                        onChange={handleChange}
                      />
                    </label>
                    <label className={styles.formLabel}>
                      Weaknesses:
                      <input
                        type="text"
                        name="weaknesses"
                        value={formData.weaknesses}
                        onChange={handleChange}
                      />
                    </label>
                  </>
                )}

                <div className={styles.buttonContainer}>
                  {currentStep > 0 && <button type="button" className={styles.resumeFormButton} onClick={prevStep}>Back</button>}
                  {currentStep < 1 ? (
                    <button type="button" className={styles.resumeFormButton} onClick={nextStep}>Next</button>
                  ) : (
                    <button type="submit" style={{ marginLeft: 'auto', backgroundColor: 'lightgreen' }} className={styles.resumeFormButton}>Create Resume</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={styles.resumesList}>
          <h1>Your Resumes</h1>
          {resumes.length > 0 ? (
            <div className={styles.resumeCardsContainer}>
              {resumes.map((resume, index) => (
                <div key={index} className={styles.resumeCard}>
                  <h3>{resume.name}</h3>
                  <div className={styles.resumeActions}>
                    <button className={styles.downloadButton} onClick={() => downloadResume(resume)}>Download</button>
                    <button className={styles.editButton} onClick={() => handleEditResume(index)}>Edit</button>
                    <div className={styles.deleteIcon} onClick={() => handleDeleteResume(resume.rId)}>
                      <i className="fas fa-trash-alt"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No resumes created yet.</p>
          )}
        </div>
      </div>
    </>
  );
}