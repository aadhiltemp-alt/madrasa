import prisma from '@/lib/prisma';
import styles from './page.module.css';
import Countdown from './Countdown';
import BannerSlider from './BannerSlider';

export const revalidate = 0; // Disable cache for live statistics

export default async function Home() {
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

  const nextExam = await prisma.exam.findFirst({
    where: { markEntryDeadline: { gte: new Date() } },
    orderBy: { markEntryDeadline: 'asc' },
  });

  // Safe fallback if no institution data
  if (!institution) {
    return <div>Loading... Please ensure database is seeded.</div>;
  }

  // Calculate target date for countdown (or fallback to end of year)
  const countdownDate = nextExam?.markEntryDeadline || new Date(new Date().getFullYear(), 11, 31);
  const countdownISO = countdownDate.toISOString();

  return (
    <main>
      <section className={styles.heroSection}>
        <BannerSlider banners={institution.banners} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{institution.name}</h1>
          <p className={styles.heroSubtitle}>Dedicated to excellence in Islamic and modern education.</p>
          
          {institution.showCountdown && (
            <div className={styles.countdownBox}>
              <h3>Upcoming Exam Result Countdown</h3>
              <p style={{marginTop: '0.5rem', color: 'var(--text-muted)'}}>{nextExam ? nextExam.name : 'Final Examinations'}</p>
              <Countdown targetDate={countdownISO} />
            </div>
          )}
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className={`${styles.statsSection} container`}>
        <h2 className={styles.sectionTitle}>Our Institution at a Glance</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{institution.maleStudents}</div>
            <div className={styles.statLabel}>Male Students</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{institution.femaleStudents}</div>
            <div className={styles.statLabel}>Female Students</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{institution.maleStudents + institution.femaleStudents}</div>
            <div className={styles.statLabel}>Total Students</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{institution.expertFaculty}</div>
            <div className={styles.statLabel}>Expert Faculty</div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section className={styles.committeeSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Management Committee</h2>
          <div className={styles.committeeGrid}>
            {institution.committee.map(member => (
              <div key={member.id} className={styles.committeeCard}>
                <img 
                  src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.name}&background=800000&color=fff&size=250`} 
                  alt={member.name} 
                  className={styles.committeePhoto} 
                />
                <div className={styles.committeeInfo}>
                  <h3 className={styles.committeeName}>{member.name}</h3>
                  <div className={styles.committeeRole}>{member.role}</div>
                  <div className={styles.committeePhone}>{member.phone || 'Contact not available'}</div>
                </div>
              </div>
            ))}
            {institution.committee.length === 0 && <p style={{textAlign: 'center', gridColumn: '1/-1'}}>No committee members listed yet.</p>}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className={styles.committeeSection} style={{background: '#fff', paddingTop: 0}}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Madrasa Staff</h2>
          <div className={styles.committeeGrid}>
            {staff.map(user => (
              <div key={user.id} className={styles.committeeCard}>
                <img 
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=d4af37&color=fff&size=250`} 
                  alt={user.name} 
                  className={styles.committeePhoto} 
                />
                <div className={styles.committeeInfo}>
                  <h3 className={styles.committeeName}>{user.name}</h3>
                  <div className={styles.committeeRole}>
                    {user.assignedClasses.length > 0 
                      ? `Class Teacher: ${user.assignedClasses.map(c => c.name).join(', ')}` 
                      : 'Faculty Member'}
                  </div>
                  <div className={styles.committeePhone}>{user.phone || 'Academic Staff'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <h3 className={styles.footerTitle}>{institution.name}</h3>
              <p>Inspiring minds, nurturing faith, and building a better tomorrow.</p>
            </div>
            <div className={styles.footerContact}>
              <h3 className={styles.footerTitle}>Contact Us</h3>
              <p>📍 {institution.address}</p>
              <p>📞 {institution.contactNumbers}</p>
              <p>✉️ {institution.email}</p>
              <p>💬 WhatsApp: {institution.whatsapp}</p>
            </div>
            <div>
              <h3 className={styles.footerTitle}>Quick Links</h3>
              <ul style={{listStyle: 'none', padding: 0, lineHeight: '2'}}>
                <li><a href="/student">Student Results Portal</a></li>
                <li><a href="/teacher">Teacher Portal</a></li>
                <li><a href="/admin">Admin Dashboard</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} {institution.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
