'use client';

import { useState, useMemo } from 'react';
import { saveMarks } from '@/app/actions/students';
import styles from '@/app/admin/admin.module.css';

export default function MarksClient({ classId, students, subjects, exams, existingMarks }: any) {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectedExam = exams.find((e: any) => e.id === selectedExamId);
  const isPastDeadline = selectedExam && new Date() > new Date(selectedExam.markEntryDeadline);

  // Initialize spreadsheet state: state[studentId][subjectId] = mark
  const initialMarks = useMemo(() => {
    const marks: Record<string, Record<string, string>> = {};
    students.forEach((student: any) => {
      marks[student.id] = {};
      subjects.forEach((subject: any) => {
        const existing = existingMarks.find(
          (m: any) => m.studentId === student.id && m.subjectId === subject.id && m.examId === selectedExamId
        );
        marks[student.id][subject.id] = existing ? existing.marksObtained.toString() : '';
      });
    });
    return marks;
  }, [students, subjects, existingMarks, selectedExamId]);

  const [marksState, setMarksState] = useState(initialMarks);

  const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
    if (isPastDeadline) return;
    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: value
      }
    }));
  };

  const handleSave = async () => {
    if (isPastDeadline) {
      setMessage('Deadline has passed. Cannot save marks.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const marksData: any[] = [];
      students.forEach((student: any) => {
        subjects.forEach((subject: any) => {
          const val = marksState[student.id][subject.id];
          if (val !== '' && !isNaN(parseFloat(val))) {
            marksData.push({
              studentId: student.id,
              subjectId: subject.id,
              marksObtained: parseFloat(val)
            });
          }
        });
      });

      await saveMarks(classId, selectedExamId, marksData);
      setMessage('Marks saved successfully!');
    } catch (e) {
      console.error(e);
      setMessage('Failed to save marks.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.card} style={{gridColumn: '1 / -1'}}>
      <div style={{marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <label style={{fontWeight: 'bold', color: 'var(--text-color)'}}>Select Exam:</label>
        <select 
          className="input" 
          style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', minWidth: '200px'}}
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
        >
          {exams.map((e: any) => (
            <option key={e.id} value={e.id}>{e.name} (Deadline: {new Date(e.markEntryDeadline).toLocaleString()})</option>
          ))}
        </select>
        {isPastDeadline && (
          <span style={{color: 'red', fontWeight: 'bold'}}>🔒 Mark entry closed (Deadline passed)</span>
        )}
      </div>

      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center'}}>
          <thead>
            <tr style={{background: 'var(--maroon-primary)', color: 'white'}}>
              <th style={{padding: '1rem', textAlign: 'left', minWidth: '150px'}}>Reg No.</th>
              <th style={{padding: '1rem', textAlign: 'left', minWidth: '200px'}}>Student Name</th>
              {subjects.map((sub: any) => (
                <th key={sub.id} style={{padding: '1rem'}} title={`Total: ${sub.totalMarks}, Pass: ${sub.passingMarks}`}>
                  {sub.name}<br/>
                  <small style={{fontWeight: 'normal'}}>Out of {sub.totalMarks}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student.id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '0.75rem', textAlign: 'left', fontWeight: 'bold'}}>{student.registerNumber}</td>
                <td style={{padding: '0.75rem', textAlign: 'left'}}>{student.name}</td>
                {subjects.map((sub: any) => (
                  <td key={sub.id} style={{padding: '0.75rem'}}>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={sub.totalMarks}
                      disabled={isPastDeadline}
                      value={marksState[student.id]?.[sub.id] || ''}
                      onChange={(e) => handleMarkChange(student.id, sub.id, e.target.value)}
                      style={{
                        width: '80px', 
                        padding: '0.5rem', 
                        textAlign: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: isPastDeadline ? '#f5f5f5' : 'white'
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <button 
          onClick={handleSave} 
          disabled={saving || isPastDeadline}
          className="btn-primary"
        >
          {saving ? 'Saving...' : 'Save All Marks'}
        </button>
        {message && <span style={{color: message.includes('success') ? 'green' : 'red', fontWeight: 'bold'}}>{message}</span>}
      </div>
    </div>
  );
}
