import prisma from '@/lib/prisma';
import styles from './page.module.css';
import Countdown from './Countdown';
import BannerSlider from './BannerSlider';
import ExpandableSection from './ExpandableSection';
import Link from 'next/link';

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

  // Find the next upcoming result release (where results are NOT yet published)
  const nextResultRelease = await prisma.exam.findFirst({
    where: { 
      publishResults: false,
      resultReleaseTime: { gte: new Date() }
    },
    orderBy: { resultReleaseTime: 'asc' },
  });

  // Check if there are any published results available
  const publishedExam = await prisma.exam.findFirst({
    where: { publishResults: true },
    orderBy: { markEntryDeadline: 'desc' }
  });

  // Safe fallback if no institution data
  if (!institution) {
    return <div>Loading... Please ensure database is seeded.</div>;
  }

  // Calculate target date for countdown
  const countdownDate = nextResultRelease?.resultReleaseTime || null;

  return (
    <main>
      <section className={styles.heroSection}>
        <BannerSlider banners={institution.banners} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{institution.name}</h1>
          <p className={styles.heroSubtitle}>{institution.subtitle}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            {publishedExam && (
              <Link href="/student/result" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.25rem', boxShadow: '0 0 20px rgba(184, 134, 11, 0.5)' }}>
                Check Result 🎓
              </Link>
            )}

            {institution.showCountdown && countdownDate && (
              <div className={styles.countdownBox}>
                <p className={styles.countdownText}>
                  {nextResultRelease ? `${nextResultRelease.name} Result Release In:` : 'Results Releasing In:'}
                </p>
                <Countdown targetDate={countdownDate.toISOString()} />
              </div>
            )}
          </div>
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

      <ExpandableSection>
        {/* Management Committee Section */}
        <section className={styles.committeeSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Management Committee</h2>
            <div className={styles.committeeGrid}>
              {institution.committee.map((member) => (
                <div key={member.id} className={styles.committeeCard}>
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className={styles.committeePhoto} />
                  ) : (
                    <div className={styles.committeePhoto} style={{display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '4rem', color: 'white', background: 'var(--maroon-dark)'}}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className={styles.committeeInfo}>
                    <h3 className={styles.committeeName}>{member.name}</h3>
                    <p className={styles.committeeRole}>{member.role}</p>
                    {member.phone && <p className={styles.committeePhone}>{member.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Staff Section */}
        <section className={styles.committeeSection} style={{backgroundColor: '#fff'}}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Our Dedicated Staff</h2>
            <div className={styles.committeeGrid}>
              {staff.map((teacher) => (
                <div key={teacher.id} className={styles.committeeCard}>
                  {teacher.photoUrl ? (
                    <img src={teacher.photoUrl} alt={teacher.name} className={styles.committeePhoto} />
                  ) : (
                    <div className={styles.committeePhoto} style={{display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '4rem', color: 'white', background: 'var(--maroon-primary)'}}>
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className={styles.committeeInfo}>
                    <h3 className={styles.committeeName}>{teacher.name}</h3>
                    <p className={styles.committeeRole}>
                      {teacher.assignedClasses.map(c => c.name).join(', ') || 'Faculty Member'}
                    </p>
                    {teacher.phone && <p className={styles.committeePhone}>{teacher.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ExpandableSection>

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
