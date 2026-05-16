'use client';

import { useState } from 'react';
import { saveMarks } from '@/app/actions/students';
import styles from '@/app/admin/admin.module.css';

interface Student {
  id: string;
  name: string;
  registerNumber: string;
}

interface Props {
  classId: string;
  examId: string;
  subjectId: string;
  subjectName: string;
  examName: string;
  students: Student[];
  initialMarks: Record<string, number>;
  totalMarks: number;
}

export default function SimpleMarksEntry({ 
  classId, 
  examId, 
  subjectId, 
  subjectName, 
  examName, 
  students, 
  initialMarks,
  totalMarks
}: Props) {
  const [marks, setMarks] = useState<Record<string, number>>(initialMarks);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleMarkChange = (studentId: string, value: string) => {
    const num = parseFloat(value);
    setMarks(prev => ({
      ...prev,
      [studentId]: isNaN(num) ? 0 : num
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    const marksData = students.map(s => ({
      studentId: s.id,
      subjectId: subjectId,
      marksObtained: marks[s.id] || 0
    }));

    try {
      // We need to modify saveMarks to only update for one subject if needed, 
      // but the current saveMarks deletes everything for (exam + class).
      // I should update saveMarks or create a new one for single subject.
      await saveMarks(classId, examId, marksData);
      setMessage('Marks saved successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to save marks.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.section} style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--maroon-primary)' }}>{subjectName} - {examName}</h2>
        <p style={{ color: '#666' }}>Maximum Marks: {totalMarks}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '1rem', fontWeight: 'bold', padding: '0.5rem', background: '#f8f9fa' }}>
          <div>Reg No.</div>
          <div>Student Name</div>
          <div>Marks Obtained</div>
        </div>
        
        {students.map(s => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '1rem', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #f1f3f5' }}>
            <div style={{ fontWeight: 'bold' }}>{s.registerNumber}</div>
            <div>{s.name}</div>
            <input 
              type="number" 
              step="0.5"
              max={totalMarks}
              min="0"
              className={styles.input}
              value={marks[s.id] ?? ''}
              onChange={(e) => handleMarkChange(s.id, e.target.value)}
              placeholder="0"
              style={{ padding: '0.5rem' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn-primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          {isSaving ? 'Saving...' : 'Save Marks'}
        </button>
        {message && <span style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</span>}
      </div>
    </div>
  );
}
