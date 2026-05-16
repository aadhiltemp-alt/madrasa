import prisma from '@/lib/prisma';
import styles from './page.module.css';
import { updateInstitution } from '@/app/actions/institution';
import { addCommitteeMember, deleteCommitteeMember, updateTeacherPhoto } from '@/app/actions/committee';
import { addBanner, deleteBanner } from '@/app/actions/banners';

export const revalidate = 0;

export default async function InstitutionConfig() {
  const institution = await prisma.institution.findUnique({
    where: { id: 1 },
    include: { 
      committee: { orderBy: { order: 'asc' } },
      banners: { orderBy: { order: 'asc' } }
    }
  });

  const staff = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    include: { assignedClasses: true }
  });

  if (!institution) {
    return <div>Database Error: Institution not found.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="pageTitle" style={{ marginBottom: '2rem' }}>Institution Configuration</h1>

      <div className={styles.section} style={{ background: '#fffbeb', border: '1px solid #fde68a', marginBottom: '2rem' }}>
        <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>💡 Quick Tip: Free Photo Resources</h3>
        <p style={{ fontSize: '0.9rem', color: '#92400e' }}>
          Use these sites to get professional photos or avatars for your members:
          <br />
          • <strong>UI Avatars:</strong> <code>https://ui-avatars.com/api/?name=User+Name&background=800000&color=fff</code>
          <br />
          • <strong>Unsplash:</strong> <code>https://images.unsplash.com/photo-XXXXXXX</code>
          <br />
          • <strong>DiceBear:</strong> <code>https://api.dicebear.com/7.x/initials/svg?seed=Name</code>
        </p>
      </div>
      
      <form action={updateInstitution}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>General Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Institution Name</label>
              <input type="text" name="name" className={styles.input} defaultValue={institution.name} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Numbers</label>
              <input type="text" name="contactNumbers" className={styles.input} defaultValue={institution.contactNumbers} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" name="email" className={styles.input} defaultValue={institution.email} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp Number</label>
              <input type="text" name="whatsapp" className={styles.input} defaultValue={institution.whatsapp} required />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Address</label>
              <textarea name="address" className={styles.input} defaultValue={institution.address} rows={3} required />
            </div>
            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="showCountdown" id="showCountdown" defaultChecked={institution.showCountdown} style={{ width: 'auto' }} />
              <label htmlFor="showCountdown" className={styles.label} style={{ margin: 0 }}>Activate Hero Result Countdown</label>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Live Statistics</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Male Students</label>
              <input type="number" name="maleStudents" className={styles.input} defaultValue={institution.maleStudents} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Female Students</label>
              <input type="number" name="femaleStudents" className={styles.input} defaultValue={institution.femaleStudents} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expert Faculty</label>
              <input type="number" name="expertFaculty" className={styles.input} defaultValue={institution.expertFaculty} required />
            </div>
          </div>
        </div>

        <button type="submit" className={`btn-primary ${styles.submitBtn}`} style={{ marginBottom: '3rem' }}>
          Save General Configuration
        </button>
      </form>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Management Committee</h2>
        
        <form action={addCommitteeMember} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #eee' }}>
          <h4 style={{ marginBottom: '1rem' }}>Add New Member</h4>
          <div className={styles.formGrid}>
            <input type="text" name="name" placeholder="Full Name" className={styles.input} required />
            <input type="text" name="role" placeholder="Role (e.g. President)" className={styles.input} required />
            <input type="text" name="phone" placeholder="Phone Number" className={styles.input} />
            <input type="text" name="photoUrl" placeholder="Photo URL" className={styles.input} />
            <input type="number" name="order" placeholder="Display Order" className={styles.input} defaultValue={0} />
            <button type="submit" className="btn-gold">Add Member</button>
          </div>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {institution.committee.map(member => (
            <div key={member.id} className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <img 
                src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.name}&background=800000&color=fff`} 
                alt={member.name} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} 
              />
              <h4 style={{ color: 'var(--maroon-primary)' }}>{member.name}</h4>
              <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{member.role}</p>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>{member.phone}</p>
              <form action={deleteCommitteeMember.bind(null, member.id)} style={{ marginTop: '1rem' }}>
                <button type="submit" style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Madrasa Staff</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Update staff photos and assign them to classes so parents can identify their class teachers.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {staff.map(user => (
            <div key={user.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <img 
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=800000&color=fff`} 
                  alt={user.name} 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold-primary)' }} 
                />
                <div>
                  <h4 style={{ color: 'var(--maroon-primary)', fontSize: '1.2rem' }}>{user.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gold-dark)', fontWeight: '600' }}>
                    {user.assignedClasses.length > 0 
                      ? `Class Teacher: ${user.assignedClasses.map(c => c.name).join(', ')}` 
                      : 'Staff Member'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>{user.phone || 'No phone added'}</p>
                </div>
              </div>
              
              <form action={async (formData) => {
                'use server';
                const url = formData.get('photoUrl') as string;
                await updateTeacherPhoto(user.id, url);
              }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    name="photoUrl" 
                    placeholder="Update Photo URL" 
                    className={styles.input} 
                    defaultValue={user.photoUrl || ''} 
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }} 
                  />
                  <button type="submit" className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    Update Photo
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#999' }}>
                  * Note: To change assigned classes, go to the <strong>Teachers</strong> management page.
                </p>
              </form>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Home Page Sliding Banners</h2>
        
        <form action={addBanner} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #eee' }}>
          <h4 style={{ marginBottom: '1rem' }}>Add New Banner Image</h4>
          <div className={styles.formGrid}>
            <input type="text" name="imageUrl" placeholder="Banner Image URL (Landscape recommended)" className={styles.input} required />
            <input type="number" name="order" placeholder="Display Order" className={styles.input} defaultValue={0} />
            <button type="submit" className="btn-gold">Add Banner</button>
          </div>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {institution.banners.map(banner => (
            <div key={banner.id} className="glass-panel" style={{ padding: '1rem' }}>
              <img 
                src={banner.imageUrl} 
                alt="Banner" 
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Order: {banner.order}</span>
                <form action={deleteBanner.bind(null, banner.id)}>
                  <button type="submit" style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </form>
              </div>
            </div>
          ))}
          {institution.banners.length === 0 && <p>No banner images added yet.</p>}
        </div>
      </div>
    </div>
  );
}
