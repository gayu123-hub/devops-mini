/**
 * MediCare - Smart Doctor Appointment System
 * Core Application Logic & State Management
 */

// Global State
const appState = {
  currentTab: 'all',
  activeAvailabilityFilter: 'all',
  selectedDoctorForProfile: null,
  appointmentToCancelId: null,
  booking: {
    step: 1,
    doctor: null,
    speciality: '',
    date: '',
    slot: '',
    patient: {
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      reason: ''
    }
  }
};

const STORAGE_KEY = 'medicare_appointments';

/* --------------------------------------------------------------------------
   1. Initialization & LocalStorage Setup
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initializeStorage();
  initializeDatePickers();
  renderSpecialities();
  renderDoctorsGrid();
  renderAppointments();
  renderTestimonials();
  setupScrollSpy();
  setupCounters();
  setupMobileNav();

  // Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/**
 * Initializes localStorage with realistic sample appointments if empty
 */
function initializeStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
  }
  updateApptBadge();
}

function getAppointments() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error parsing appointments from storage:', e);
    return [];
  }
}

function saveAppointments(appts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appts));
    updateApptBadge();
  } catch (e) {
    console.error('Error saving appointments to storage:', e);
  }
}

function updateApptBadge() {
  const appts = getAppointments();
  const confirmedCount = appts.filter(a => a.status === 'Confirmed').length;
  const badgeEl = document.getElementById('navApptBadge');
  if (badgeEl) {
    badgeEl.textContent = confirmedCount;
  }
  
  // Update tabs counter
  const countAll = document.getElementById('countTabAll');
  const countConf = document.getElementById('countTabConfirmed');
  const countCanc = document.getElementById('countTabCancelled');
  if (countAll) countAll.textContent = appts.length;
  if (countConf) countConf.textContent = confirmedCount;
  if (countCanc) countCanc.textContent = appts.filter(a => a.status === 'Cancelled').length;
}

/**
 * Sets minimum booking date to today and default value
 */
function initializeDatePickers() {
  const dateInput = document.getElementById('modalDate');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  dateInput.min = minDateStr;
  
  // Tomorrow as default
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tYyyy = tomorrow.getFullYear();
  const tMm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const tDd = String(tomorrow.getDate()).padStart(2, '0');
  dateInput.value = `${tYyyy}-${tMm}-${tDd}`;
  appState.booking.date = dateInput.value;
}

/* --------------------------------------------------------------------------
   2. Specialities Section Rendering & Interaction
   -------------------------------------------------------------------------- */
function renderSpecialities() {
  const container = document.getElementById('specialitiesGrid');
  if (!container) return;

  container.innerHTML = SPECIALITIES_DATA.map(spec => `
    <div class="speciality-card" onclick="filterBySpeciality('${spec.name}')" role="button" tabindex="0">
      <div class="speciality-header">
        <div class="speciality-icon-box" style="background: ${spec.color}15; color: ${spec.color};">
          <i class="${spec.icon}"></i>
        </div>
        <span class="speciality-badge">${spec.doctorCount} Specialists</span>
      </div>
      <h3 class="speciality-name">${spec.name}</h3>
      <p class="speciality-desc">${spec.description}</p>
      <div class="speciality-footer">
        <span>Consult Specialists</span>
        <i class="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  `).join('');
}

function filterBySpeciality(specialityName) {
  const specialitySelect = document.getElementById('specialityFilter');
  if (specialitySelect) {
    specialitySelect.value = specialityName;
    handleSearchClick();
  }

  // Smooth scroll to doctors section
  const section = document.getElementById('doctors');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }

  showToast(`Filtered by ${specialityName}`, `Showing verified ${specialityName} doctors.`, 'info');
}

/* --------------------------------------------------------------------------
   3. Doctor Directory & Search/Filter
   -------------------------------------------------------------------------- */
function renderDoctorsGrid(doctorsToRender = DOCTORS_DATA) {
  const container = document.getElementById('doctorsGrid');
  const counterEl = document.getElementById('filterResultsCount');
  if (!container) return;

  if (counterEl) {
    counterEl.innerHTML = `Showing <strong>${doctorsToRender.length}</strong> of ${DOCTORS_DATA.length} verified doctors`;
  }

  if (doctorsToRender.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        <h3>No Specialists Found</h3>
        <p>We couldn't find any doctors matching your search filters. Try adjusting keywords or clearing filters.</p>
        <button class="btn btn-secondary" onclick="resetSearchFilters()">
          <i class="fa-solid fa-rotate-left"></i> Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = doctorsToRender.map(doc => `
    <div class="doctor-card" id="card-${doc.id}">
      <div class="doctor-card-top">
        <div class="doc-avatar-wrap">
          <img src="${doc.image}" alt="${doc.name}" class="doc-avatar" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 100 100\\\'><circle cx=\\\'50\\\' cy=\\\'50\\\' r=\\\'50\\\' fill=\\\'%23ccfbf1\\\'/><path d=\\\'M50 45a16 16 0 1 0 0-32 16 16 0 0 0 0 32zm0 8c-18 0-34 11-34 26v4h68v-4c0-15-16-26-34-26z\\\' fill=\\\'%230d9488\\\'/></svg>'">
          <div class="doc-verified-badge" title="Board-Certified Specialist">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
        <div class="doc-info-meta">
          <span class="doc-speciality-chip">${doc.specialization}</span>
          <h3 class="doc-name">${doc.name}</h3>
          <p class="doc-qualification">${doc.qualification}</p>
          <div class="doc-rating-badge">
            <i class="fa-solid fa-star"></i>
            <strong>${doc.rating}</strong>
            <span>(${doc.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div class="doctor-card-body">
        <div class="doc-details-row">
          <div class="doc-detail-item">
            <i class="fa-solid fa-hospital"></i>
            <span>${doc.hospital}</span>
          </div>
        </div>

        <div class="doc-details-row">
          <div class="doc-detail-item">
            <i class="fa-solid fa-briefcase"></i>
            <span><strong>${doc.experienceYears} Years</strong> Exp</span>
          </div>
          <div class="doc-fee-highlight">
            $${doc.consultationFee} <span>/ Visit</span>
          </div>
        </div>

        <!-- Available time slots preview -->
        <div class="doc-slots-preview">
          <div class="doc-slots-title">
            <span>Available Slots:</span>
            <span style="color: var(--teal-600); font-weight: 600;">
              ${doc.availableToday ? 'Available Today' : 'Next Available Tomorrow'}
            </span>
          </div>
          <div class="doc-slots-list">
            ${doc.timeSlots.slice(0, 3).map(slot => `<span class="slot-tag"><i class="fa-regular fa-clock" style="font-size: 0.7rem; margin-right: 0.2rem;"></i>${slot}</span>`).join('')}
            ${doc.timeSlots.length > 3 ? `<span class="slot-tag" style="background: var(--teal-50); color: var(--teal-700);">+${doc.timeSlots.length - 3} more</span>` : ''}
          </div>
        </div>
      </div>

      <div class="doctor-card-footer">
        <button class="btn btn-secondary btn-sm" onclick="openDoctorProfileModal('${doc.id}')">
          <i class="fa-regular fa-id-card"></i> Profile
        </button>
        <button class="btn btn-primary btn-sm" onclick="openBookingModal('${doc.id}')">
          <i class="fa-solid fa-calendar-check"></i> Book Now
        </button>
      </div>
    </div>
  `).join('');
}

function handleSearchClick() {
  const searchTerm = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const selectedSpeciality = document.getElementById('specialityFilter')?.value || 'all';
  const sortOption = document.getElementById('sortFilter')?.value || 'rating';
  const availability = appState.activeAvailabilityFilter;

  let filtered = DOCTORS_DATA.filter(doc => {
    // Search keyword match
    const matchesSearch = !searchTerm || 
      doc.name.toLowerCase().includes(searchTerm) ||
      doc.specialization.toLowerCase().includes(searchTerm) ||
      doc.hospital.toLowerCase().includes(searchTerm) ||
      doc.qualification.toLowerCase().includes(searchTerm);

    // Speciality filter match
    const matchesSpec = (selectedSpeciality === 'all') || (doc.specialization === selectedSpeciality);

    // Availability filter match
    let matchesAvailability = true;
    if (availability === 'today') {
      matchesAvailability = doc.availableToday === true;
    } else if (availability === 'tomorrow') {
      matchesAvailability = doc.availableTomorrow === true;
    }

    return matchesSearch && matchesSpec && matchesAvailability;
  });

  // Sorting
  if (sortOption === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === 'experience') {
    filtered.sort((a, b) => b.experienceYears - a.experienceYears);
  } else if (sortOption === 'fee-low') {
    filtered.sort((a, b) => a.consultationFee - b.consultationFee);
  } else if (sortOption === 'fee-high') {
    filtered.sort((a, b) => b.consultationFee - a.consultationFee);
  }

  renderDoctorsGrid(filtered);
}

// Live typing search
document.getElementById('searchInput')?.addEventListener('input', () => {
  handleSearchClick();
});

document.getElementById('specialityFilter')?.addEventListener('change', () => {
  handleSearchClick();
});

document.getElementById('sortFilter')?.addEventListener('change', () => {
  handleSearchClick();
});

function setAvailabilityFilter(type, btnElement) {
  appState.activeAvailabilityFilter = type;
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  handleSearchClick();
}

function resetSearchFilters() {
  const searchInput = document.getElementById('searchInput');
  const specialitySelect = document.getElementById('specialityFilter');
  const sortSelect = document.getElementById('sortFilter');

  if (searchInput) searchInput.value = '';
  if (specialitySelect) specialitySelect.value = 'all';
  if (sortSelect) sortSelect.value = 'rating';

  appState.activeAvailabilityFilter = 'all';
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.availability === 'all');
  });

  renderDoctorsGrid(DOCTORS_DATA);
  showToast('Filters Reset', 'Displaying all verified doctors.', 'info');
}

/* --------------------------------------------------------------------------
   4. Doctor Profile Modal
   -------------------------------------------------------------------------- */
function openDoctorProfileModal(doctorId) {
  const doc = DOCTORS_DATA.find(d => d.id === doctorId);
  if (!doc) return;

  appState.selectedDoctorForProfile = doc;

  document.getElementById('profModalImg').src = doc.image;
  document.getElementById('profModalImg').alt = doc.name;
  document.getElementById('profModalName').textContent = doc.name;
  document.getElementById('profModalQual').textContent = doc.qualification;
  document.getElementById('profModalSpeciality').textContent = doc.specialization;
  document.getElementById('profModalRating').textContent = doc.rating;
  document.getElementById('profModalExp').textContent = doc.experienceYears;
  document.getElementById('profModalFee').textContent = doc.consultationFee;
  document.getElementById('profModalBio').textContent = doc.bio;
  document.getElementById('profModalEdu').textContent = doc.education;
  document.getElementById('profModalHospital').textContent = doc.hospital;
  document.getElementById('profModalLanguages').textContent = doc.languages.join(', ');

  const overlay = document.getElementById('doctorProfileModalOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeDoctorProfileModal() {
  const overlay = document.getElementById('doctorProfileModalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function bookFromDoctorProfile() {
  if (appState.selectedDoctorForProfile) {
    const docId = appState.selectedDoctorForProfile.id;
    closeDoctorProfileModal();
    openBookingModal(docId);
  }
}

/* --------------------------------------------------------------------------
   5. Appointment Booking Modal (Interactive 3-Step Wizard)
   -------------------------------------------------------------------------- */
function openBookingModal(preselectedDoctorId = null) {
  resetBookingForm();

  // Populate doctor select options
  populateModalDoctorSelect();

  if (preselectedDoctorId) {
    const doc = DOCTORS_DATA.find(d => d.id === preselectedDoctorId);
    if (doc) {
      const specSelect = document.getElementById('modalSpeciality');
      const docSelect = document.getElementById('modalDoctor');

      if (specSelect) specSelect.value = doc.specialization;
      populateModalDoctorSelect(doc.specialization);
      if (docSelect) docSelect.value = doc.id;

      appState.booking.speciality = doc.specialization;
      appState.booking.doctor = doc;
      updateSelectedDocBanner(doc);
    }
  }

  // Update slots for currently selected date and doctor
  renderTimeSlotsForSelectedDoctor();

  // Open modal
  const overlay = document.getElementById('bookingModalOverlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const overlay = document.getElementById('bookingModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function resetBookingForm() {
  appState.booking = {
    step: 1,
    doctor: null,
    speciality: '',
    date: document.getElementById('modalDate')?.value || '',
    slot: '',
    patient: {
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      reason: ''
    }
  };

  // Clear inputs
  document.getElementById('modalSpeciality').value = '';
  document.getElementById('modalDoctor').innerHTML = '<option value="">-- Choose Doctor --</option>';
  document.getElementById('modalSelectedSlot').value = '';
  document.getElementById('patientFullName').value = '';
  document.getElementById('patientAge').value = '';
  document.getElementById('patientGender').value = '';
  document.getElementById('patientPhone').value = '';
  document.getElementById('patientEmail').value = '';
  document.getElementById('patientReason').value = '';

  // Hide doctor quick banner
  const banner = document.getElementById('modalDoctorBanner');
  if (banner) banner.style.display = 'none';

  // Clear error classes
  document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error-border'));

  setBookingStep(1);
}

function setBookingStep(step) {
  appState.booking.step = step;

  // Toggle step bodies
  document.getElementById('bookingStep1').classList.toggle('active', step === 1);
  document.getElementById('bookingStep2').classList.toggle('active', step === 2);
  document.getElementById('bookingStep3').classList.toggle('active', step === 3);

  // Indicators
  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');
  const ind3 = document.getElementById('stepIndicator3');

  ind1.className = `step-indicator ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`;
  ind2.className = `step-indicator ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`;
  ind3.className = `step-indicator ${step === 3 ? 'active' : ''}`;

  // Footer buttons
  const backBtn = document.getElementById('btnModalBack');
  const nextBtn = document.getElementById('btnModalNext');

  if (step === 1) {
    backBtn.style.visibility = 'hidden';
    nextBtn.innerHTML = 'Continue to Patient Info <i class="fa-solid fa-arrow-right"></i>';
  } else if (step === 2) {
    backBtn.style.visibility = 'visible';
    nextBtn.innerHTML = 'Review Summary <i class="fa-solid fa-arrow-right"></i>';
  } else if (step === 3) {
    backBtn.style.visibility = 'visible';
    nextBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Confirm & Book Appointment';
    populateBookingSummary();
  }
}

function populateModalDoctorSelect(filterSpeciality = '') {
  const docSelect = document.getElementById('modalDoctor');
  if (!docSelect) return;

  let doctors = DOCTORS_DATA;
  if (filterSpeciality && filterSpeciality !== 'all') {
    doctors = DOCTORS_DATA.filter(d => d.specialization === filterSpeciality);
  }

  docSelect.innerHTML = '<option value="">-- Choose Doctor --</option>' +
    doctors.map(d => `<option value="${d.id}">${d.name} (${d.specialization}) - $${d.consultationFee}</option>`).join('');
}

function onModalSpecialityChange() {
  const spec = document.getElementById('modalSpeciality').value;
  appState.booking.speciality = spec;
  appState.booking.slot = '';
  document.getElementById('modalSelectedSlot').value = '';
  populateModalDoctorSelect(spec);
  appState.booking.doctor = null;
  updateSelectedDocBanner(null);
  renderTimeSlotsForSelectedDoctor();
}

function onModalDoctorChange() {
  const docId = document.getElementById('modalDoctor').value;
  const doc = DOCTORS_DATA.find(d => d.id === docId);
  appState.booking.doctor = doc || null;
  appState.booking.slot = '';
  document.getElementById('modalSelectedSlot').value = '';
  updateSelectedDocBanner(doc);
  renderTimeSlotsForSelectedDoctor();
}

function onModalDateChange() {
  const dateVal = document.getElementById('modalDate').value;
  appState.booking.date = dateVal;
  appState.booking.slot = '';
  document.getElementById('modalSelectedSlot').value = '';
  renderTimeSlotsForSelectedDoctor();
}

function updateSelectedDocBanner(doc) {
  const banner = document.getElementById('modalDoctorBanner');
  if (!banner) return;

  if (doc) {
    banner.style.display = 'flex';
    document.getElementById('modalDocBannerImg').src = doc.image;
    document.getElementById('modalDocBannerName').textContent = doc.name;
    document.getElementById('modalDocBannerSub').textContent = `${doc.specialization} • ${doc.hospital} • Fee: $${doc.consultationFee}`;
  } else {
    banner.style.display = 'none';
  }
}

/**
 * Renders interactive time slots with live availability & duplicate booking checking
 */
function renderTimeSlotsForSelectedDoctor() {
  const container = document.getElementById('modalSlotsGrid');
  const statusEl = document.getElementById('slotsLoadingStatus');
  if (!container) return;

  const doc = appState.booking.doctor;
  const chosenDate = document.getElementById('modalDate')?.value;

  if (!doc) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--slate-400); font-size: 0.88rem; padding: 1rem;">
        <i class="fa-solid fa-user-doctor" style="margin-right: 0.4rem;"></i> Please choose a doctor and date above.
      </div>
    `;
    if (statusEl) statusEl.textContent = '';
    return;
  }

  if (!chosenDate) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--slate-400); font-size: 0.88rem; padding: 1rem;">
        <i class="fa-solid fa-calendar-day" style="margin-right: 0.4rem;"></i> Please select an appointment date.
      </div>
    `;
    if (statusEl) statusEl.textContent = '';
    return;
  }

  // Check booked slots from localStorage for this doctor and date
  const existingAppts = getAppointments();
  const bookedSlots = existingAppts
    .filter(a => a.doctorId === doc.id && a.appointmentDate === chosenDate && a.status !== 'Cancelled')
    .map(a => a.timeSlot);

  if (statusEl) {
    const availableCount = doc.timeSlots.length - bookedSlots.length;
    statusEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--teal-600)"></i> ${availableCount} of ${doc.timeSlots.length} slots open`;
  }

  // Generate slot buttons
  container.innerHTML = doc.timeSlots.map(slot => {
    const isBooked = bookedSlots.includes(slot);
    const isSelected = appState.booking.slot === slot;

    return `
      <button type="button" 
              class="slot-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
              ${isBooked ? 'disabled title="Slot already booked for this doctor and date"' : ''}
              onclick="selectTimeSlot('${slot}', this)">
        ${slot}
      </button>
    `;
  }).join('');
}

function selectTimeSlot(slot, btnEl) {
  appState.booking.slot = slot;
  document.getElementById('modalSelectedSlot').value = slot;

  document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('selected'));
  if (btnEl) btnEl.classList.add('selected');

  // Clear slot error
  document.getElementById('errModalSlot').style.display = 'none';
}

/* --------------------------------------------------------------------------
   Step Wizard Navigation & Validation
   -------------------------------------------------------------------------- */
function goToNextBookingStep() {
  if (appState.booking.step === 1) {
    if (validateStep1()) {
      setBookingStep(2);
    }
  } else if (appState.booking.step === 2) {
    if (validateStep2()) {
      setBookingStep(3);
    }
  } else if (appState.booking.step === 3) {
    finalizeAppointmentBooking();
  }
}

function goToPreviousBookingStep() {
  if (appState.booking.step > 1) {
    setBookingStep(appState.booking.step - 1);
  }
}

function validateStep1() {
  let isValid = true;

  const specSelect = document.getElementById('modalSpeciality');
  const docSelect = document.getElementById('modalDoctor');
  const dateInput = document.getElementById('modalDate');
  const slotVal = appState.booking.slot;

  // Validate Speciality
  if (!specSelect.value) {
    specSelect.classList.add('error-border');
    document.getElementById('errModalSpeciality').style.display = 'flex';
    isValid = false;
  } else {
    specSelect.classList.remove('error-border');
    document.getElementById('errModalSpeciality').style.display = 'none';
  }

  // Validate Doctor
  if (!docSelect.value) {
    docSelect.classList.add('error-border');
    document.getElementById('errModalDoctor').style.display = 'flex';
    isValid = false;
  } else {
    docSelect.classList.remove('error-border');
    document.getElementById('errModalDoctor').style.display = 'none';
  }

  // Validate Date & Past Date Prevention
  if (!dateInput.value) {
    dateInput.classList.add('error-border');
    document.getElementById('errModalDate').style.display = 'flex';
    isValid = false;
  } else {
    const selectedDateObj = new Date(dateInput.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      dateInput.classList.add('error-border');
      document.getElementById('errModalDate').textContent = 'Appointment date cannot be in the past.';
      document.getElementById('errModalDate').style.display = 'flex';
      isValid = false;
    } else {
      dateInput.classList.remove('error-border');
      document.getElementById('errModalDate').style.display = 'none';
      appState.booking.date = dateInput.value;
    }
  }

  // Validate Time Slot
  if (!slotVal) {
    document.getElementById('errModalSlot').style.display = 'flex';
    isValid = false;
  } else {
    document.getElementById('errModalSlot').style.display = 'none';
  }

  if (!isValid) {
    showToast('Missing Details', 'Please complete all required fields and select an available time slot.', 'warning');
  }

  return isValid;
}

function validateStep2() {
  let isValid = true;

  const nameInput = document.getElementById('patientFullName');
  const ageInput = document.getElementById('patientAge');
  const genderSelect = document.getElementById('patientGender');
  const phoneInput = document.getElementById('patientPhone');
  const emailInput = document.getElementById('patientEmail');
  const reasonInput = document.getElementById('patientReason');

  // Name
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    nameInput.classList.add('error-border');
    document.getElementById('errPatientFullName').style.display = 'flex';
    isValid = false;
  } else {
    nameInput.classList.remove('error-border');
    document.getElementById('errPatientFullName').style.display = 'none';
  }

  // Age
  const ageNum = parseInt(ageInput.value, 10);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    ageInput.classList.add('error-border');
    document.getElementById('errPatientAge').style.display = 'flex';
    isValid = false;
  } else {
    ageInput.classList.remove('error-border');
    document.getElementById('errPatientAge').style.display = 'none';
  }

  // Gender
  if (!genderSelect.value) {
    genderSelect.classList.add('error-border');
    document.getElementById('errPatientGender').style.display = 'flex';
    isValid = false;
  } else {
    genderSelect.classList.remove('error-border');
    document.getElementById('errPatientGender').style.display = 'none';
  }

  // Phone: At least 8-15 digits
  const phoneVal = phoneInput.value.trim();
  const phoneRegex = /^[\d\s\(\)\+\-]{8,18}$/;
  if (!phoneRegex.test(phoneVal)) {
    phoneInput.classList.add('error-border');
    document.getElementById('errPatientPhone').style.display = 'flex';
    isValid = false;
  } else {
    phoneInput.classList.remove('error-border');
    document.getElementById('errPatientPhone').style.display = 'none';
  }

  // Email
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    emailInput.classList.add('error-border');
    document.getElementById('errPatientEmail').style.display = 'flex';
    isValid = false;
  } else {
    emailInput.classList.remove('error-border');
    document.getElementById('errPatientEmail').style.display = 'none';
  }

  // Reason
  if (!reasonInput.value.trim() || reasonInput.value.trim().length < 5) {
    reasonInput.classList.add('error-border');
    document.getElementById('errPatientReason').style.display = 'flex';
    isValid = false;
  } else {
    reasonInput.classList.remove('error-border');
    document.getElementById('errPatientReason').style.display = 'none';
  }

  if (isValid) {
    appState.booking.patient = {
      name: nameInput.value.trim(),
      age: ageNum,
      gender: genderSelect.value,
      phone: phoneVal,
      email: emailVal,
      reason: reasonInput.value.trim()
    };
  } else {
    showToast('Input Validation Error', 'Please check and correct the highlighted fields.', 'warning');
  }

  return isValid;
}

function populateBookingSummary() {
  const doc = appState.booking.doctor;
  const p = appState.booking.patient;

  document.getElementById('summaryDoctor').textContent = doc ? doc.name : '-';
  document.getElementById('summarySpeciality').textContent = doc ? `${doc.specialization} (${doc.hospital})` : '-';
  
  // Format readable date
  const dateParts = appState.booking.date.split('-');
  const dateFormatted = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  document.getElementById('summaryDateTime').textContent = `${dateFormatted} at ${appState.booking.slot}`;
  
  document.getElementById('summaryPatientName').textContent = p.name;
  document.getElementById('summaryPatientMeta').textContent = `${p.age} Years • ${p.gender}`;
  document.getElementById('summaryContact').textContent = `${p.phone} • ${p.email}`;
  document.getElementById('summaryReason').textContent = p.reason;
  document.getElementById('summaryFee').textContent = doc ? `$${doc.consultationFee}` : '$0';
}

/**
 * Step 3 Finalization: Duplicate check, Save to localStorage, Generate ID, Show pass
 */
function finalizeAppointmentBooking() {
  const doc = appState.booking.doctor;
  const p = appState.booking.patient;
  const date = appState.booking.date;
  const slot = appState.booking.slot;

  if (!doc || !slot || !date) {
    showToast('Booking Error', 'Missing doctor or schedule information.', 'error');
    setBookingStep(1);
    return;
  }

  // Duplicate Check: Same Doctor + Date + Slot
  const currentAppts = getAppointments();
  const isDuplicate = currentAppts.some(a => 
    a.doctorId === doc.id && 
    a.appointmentDate === date && 
    a.timeSlot === slot && 
    a.status !== 'Cancelled'
  );

  if (isDuplicate) {
    showToast('Slot Unavailable', `This time slot (${slot}) has just been reserved. Please pick another available slot.`, 'error');
    setBookingStep(1);
    renderTimeSlotsForSelectedDoctor();
    return;
  }

  // Generate Unique ID: MED-XXXXXX
  const uniqueId = `MED-${Math.floor(100000 + Math.random() * 900000)}`;

  const newAppointment = {
    id: uniqueId,
    doctorId: doc.id,
    doctorName: doc.name,
    doctorSpeciality: doc.specialization,
    doctorImage: doc.image,
    hospital: doc.hospital,
    patientName: p.name,
    patientAge: p.age,
    patientGender: p.gender,
    patientPhone: p.phone,
    patientEmail: p.email,
    appointmentDate: date,
    timeSlot: slot,
    reason: p.reason,
    consultationFee: doc.consultationFee,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  // Prepend to appointments list
  currentAppts.unshift(newAppointment);
  saveAppointments(currentAppts);

  // Close booking modal
  closeBookingModal();

  // Render updated list
  renderAppointments();

  // Open Success Receipt Modal
  openSuccessModal(newAppointment);

  showToast('Booking Confirmed!', `Appointment #${uniqueId} booked successfully with ${doc.name}.`, 'success');
}

/* --------------------------------------------------------------------------
   6. Booking Success Modal & Digital Receipt
   -------------------------------------------------------------------------- */
function openSuccessModal(appt) {
  document.getElementById('receiptAppointmentId').textContent = `APPOINTMENT ID: ${appt.id}`;
  document.getElementById('receiptDoctorName').textContent = appt.doctorName;
  document.getElementById('receiptSpeciality').textContent = appt.doctorSpeciality;
  
  const dParts = appt.appointmentDate.split('-');
  const fDate = new Date(dParts[0], dParts[1] - 1, dParts[2]).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  document.getElementById('receiptDate').textContent = fDate;
  document.getElementById('receiptTime').textContent = appt.timeSlot;
  document.getElementById('receiptPatient').textContent = `${appt.patientName} (${appt.patientAge}y, ${appt.patientGender})`;
  document.getElementById('receiptHospital').textContent = appt.hospital;
  document.getElementById('receiptFee').textContent = `$${appt.consultationFee} (Pay at clinic)`;

  const overlay = document.getElementById('successModalOverlay');
  if (overlay) overlay.classList.add('active');
}

function closeSuccessModal() {
  const overlay = document.getElementById('successModalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function closeSuccessAndGoToAppointments() {
  closeSuccessModal();
  const section = document.getElementById('appointments');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
}

function printReceipt() {
  window.print();
}

/* --------------------------------------------------------------------------
   7. My Appointments Section Rendering & Actions
   -------------------------------------------------------------------------- */
function renderAppointments() {
  const container = document.getElementById('appointmentsContainer');
  if (!container) return;

  const appts = getAppointments();
  updateApptBadge();

  let filtered = appts;
  if (appState.currentTab === 'confirmed') {
    filtered = appts.filter(a => a.status === 'Confirmed');
  } else if (appState.currentTab === 'cancelled') {
    filtered = appts.filter(a => a.status === 'Cancelled');
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-appointments-box">
        <i class="fa-solid fa-calendar-xmark"></i>
        <h3>No ${appState.currentTab === 'all' ? '' : appState.currentTab} Appointments Found</h3>
        <p>You have no ${appState.currentTab === 'all' ? 'scheduled' : appState.currentTab} consultations at this time. Schedule your visit with our certified doctors in seconds.</p>
        <button class="btn btn-primary" onclick="openBookingModal()">
          <i class="fa-solid fa-calendar-plus"></i> Book Your First Appointment
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(appt => {
    const isCancelled = appt.status === 'Cancelled';
    const dParts = appt.appointmentDate.split('-');
    const fDate = new Date(dParts[0], dParts[1] - 1, dParts[2]).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    return `
      <div class="appointment-item-card ${isCancelled ? 'cancelled' : 'confirmed'}" id="appt-card-${appt.id}">
        <!-- Doctor Info -->
        <div class="appt-doctor-col">
          <img src="${appt.doctorImage}" alt="${appt.doctorName}" class="appt-doc-img" onerror="this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'">
          <div>
            <div class="appt-doc-name">${appt.doctorName}</div>
            <div class="appt-doc-spec">${appt.doctorSpeciality}</div>
            <div class="appt-meta-small"><i class="fa-solid fa-hospital"></i> ${appt.hospital}</div>
            <div class="appt-meta-small" style="margin-top: 0.2rem;">
              <strong>Patient:</strong> ${appt.patientName} (${appt.patientAge}y, ${appt.patientGender})
            </div>
          </div>
        </div>

        <!-- Date & Time -->
        <div class="appt-datetime-col">
          <div class="appt-date">
            <i class="fa-solid fa-calendar-day"></i> ${fDate}
          </div>
          <div class="appt-time">
            <i class="fa-solid fa-clock"></i> ${appt.timeSlot}
          </div>
          <div class="appt-meta-small" style="margin-top: 0.25rem;">
            <strong>Fee:</strong> $${appt.consultationFee}
          </div>
        </div>

        <!-- Status & ID -->
        <div class="appt-status-col">
          <span class="status-badge ${appt.status.toLowerCase()}">
            <i class="fa-solid ${isCancelled ? 'fa-ban' : 'fa-circle-check'}"></i> ${appt.status}
          </span>
          <span class="appt-id-text">ID: ${appt.id}</span>
        </div>

        <!-- Action Buttons -->
        <div class="appt-actions-col">
          <button class="btn-icon-action" title="View Appointment Receipt / Pass" onclick="viewAppointmentReceipt('${appt.id}')">
            <i class="fa-solid fa-receipt"></i>
          </button>
          
          ${!isCancelled ? `
            <button class="btn-icon-action danger" title="Cancel Appointment" onclick="confirmCancelAppointment('${appt.id}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" title="Rebook this doctor" onclick="openBookingModal('${appt.doctorId}')">
              <i class="fa-solid fa-rotate-right"></i> Rebook
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function filterAppointmentsTab(tab, btnEl) {
  appState.currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderAppointments();
}

function viewAppointmentReceipt(apptId) {
  const appts = getAppointments();
  const appt = appts.find(a => a.id === apptId);
  if (appt) {
    openSuccessModal(appt);
  }
}

function confirmCancelAppointment(apptId) {
  appState.appointmentToCancelId = apptId;
  const overlay = document.getElementById('confirmModalOverlay');
  const confirmBtn = document.getElementById('btnExecuteConfirmAction');
  
  if (confirmBtn) {
    confirmBtn.onclick = executeCancelAppointment;
  }
  
  if (overlay) overlay.classList.add('active');
}

function closeConfirmModal() {
  appState.appointmentToCancelId = null;
  const overlay = document.getElementById('confirmModalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function executeCancelAppointment() {
  const apptId = appState.appointmentToCancelId;
  if (!apptId) return;

  const appts = getAppointments();
  const targetIndex = appts.findIndex(a => a.id === apptId);
  
  if (targetIndex !== -1) {
    appts[targetIndex].status = 'Cancelled';
    saveAppointments(appts);
    renderAppointments();
    showToast('Appointment Cancelled', `Appointment #${apptId} has been cancelled.`, 'info');
  }

  closeConfirmModal();
}

/* --------------------------------------------------------------------------
   8. Testimonials Section Rendering
   -------------------------------------------------------------------------- */
function renderTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;

  container.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars">
        ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
      </div>
      <p class="testimonial-quote">"${t.feedback}"</p>
      <div class="testimonial-author">
        <img src="${t.image}" alt="${t.name}" class="testimonial-avatar" loading="lazy">
        <div class="author-meta">
          <h4>${t.name}</h4>
          <p>${t.role}</p>
          <span class="verified-tag"><i class="fa-solid fa-circle-check"></i> Verified Patient</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   9. Contact Form & Newsletter
   -------------------------------------------------------------------------- */
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contactName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value;
  const message = document.getElementById('contactMessage')?.value.trim();

  let isValid = true;

  if (!name) {
    document.getElementById('contactName').classList.add('error-border');
    document.getElementById('errContactName').style.display = 'flex';
    isValid = false;
  } else {
    document.getElementById('contactName').classList.remove('error-border');
    document.getElementById('errContactName').style.display = 'none';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    document.getElementById('contactEmail').classList.add('error-border');
    document.getElementById('errContactEmail').style.display = 'flex';
    isValid = false;
  } else {
    document.getElementById('contactEmail').classList.remove('error-border');
    document.getElementById('errContactEmail').style.display = 'none';
  }

  if (!phone) {
    document.getElementById('contactPhone').classList.add('error-border');
    document.getElementById('errContactPhone').style.display = 'flex';
    isValid = false;
  } else {
    document.getElementById('contactPhone').classList.remove('error-border');
    document.getElementById('errContactPhone').style.display = 'none';
  }

  if (!subject) {
    document.getElementById('contactSubject').classList.add('error-border');
    document.getElementById('errContactSubject').style.display = 'flex';
    isValid = false;
  } else {
    document.getElementById('contactSubject').classList.remove('error-border');
    document.getElementById('errContactSubject').style.display = 'none';
  }

  if (!message || message.length < 5) {
    document.getElementById('contactMessage').classList.add('error-border');
    document.getElementById('errContactMessage').style.display = 'flex';
    isValid = false;
  } else {
    document.getElementById('contactMessage').classList.remove('error-border');
    document.getElementById('errContactMessage').style.display = 'none';
  }

  if (!isValid) {
    showToast('Incomplete Form', 'Please complete all required fields.', 'warning');
    return;
  }

  // Simulate instant submission
  const submitBtn = document.getElementById('btnContactSubmit');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    document.getElementById('contactForm').reset();
    showToast('Message Sent!', 'Thank you! Your message has been routed to our clinical coordination team.', 'success');
  }, 800);
}

function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  if (emailInput && emailInput.value) {
    showToast('Newsletter Subscribed', `Thank you! ${emailInput.value} has been added to our health bulletin.`, 'success');
    emailInput.value = '';
  }
}

/* --------------------------------------------------------------------------
   10. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(title, message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const iconMap = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${iconMap[type] || 'fa-bell'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Dismiss toast">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  }, duration);
}

/* --------------------------------------------------------------------------
   11. UI Helpers: ScrollSpy, Animated Counters, Mobile Nav
   -------------------------------------------------------------------------- */
function setupScrollSpy() {
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Sticky navbar shadow
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function setupMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close mobile nav when clicking any nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });
}

function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const speed = target / 50;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target;
            }
          };

          updateCount();
        });
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.querySelector('.hero-stats');
  if (heroSection) observer.observe(heroSection);
}

// Close modals when clicking on background overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ESC key to close open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});
