/**
 * KALALAYA THEATRE NEPAL — OFFICIAL SCRIPT
 * Dedicated strictly to Theatre Arts, Living Stagecraft & Dramatic Repertory
 */

document.addEventListener("DOMContentLoaded", () => {
  // Determine if on login/portal page
  const pathname = window.location.pathname.toLowerCase();
  const isAuthPortal = pathname.endsWith("index.html") || pathname.endsWith("/") || pathname.includes("portal") || !pathname.includes(".html");

  // =========================================================================
  // 1. TOAST NOTIFICATIONS HELPER
  // =========================================================================
  const toastContainer = document.getElementById("toastContainer");

  function showToast(message, type = "info") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast-msg ${type}`;
    const icon = type === "success" ? "✓" : "ℹ";
    toast.innerHTML = `<span style="font-weight:700;">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  }

  // =========================================================================
  // 2. AUTHENTICATION & ACCESS GUARD
  // =========================================================================
  function getLoggedInUser() {
    try {
      return JSON.parse(localStorage.getItem("kalalaya_theatre_user") || "null");
    } catch (e) {
      return null;
    }
  }

  const currentUser = getLoggedInUser();

  // If on a content page (home, about, gallery, blog, contact) and not logged in:
  if (!isAuthPortal && !currentUser) {
    window.location.replace("index.html");
    return;
  }

  // If on portal (index.html) and already logged in:
  if (isAuthPortal && currentUser) {
    const activeSessionBanner = document.getElementById("activeSessionBanner");
    const sessionUserName = document.getElementById("sessionUserName");
    const sessionAvatar = document.getElementById("sessionAvatar");
    const sessionLogoutBtn = document.getElementById("sessionLogoutBtn");

    if (activeSessionBanner) {
      activeSessionBanner.style.display = "block";
      if (sessionUserName) sessionUserName.textContent = currentUser.name || "Member";
      if (sessionAvatar) {
        sessionAvatar.textContent = (currentUser.name || "KL").substring(0, 2).toUpperCase();
      }
    }

    if (sessionLogoutBtn) {
      sessionLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("kalalaya_theatre_user");
        window.location.reload();
      });
    }
  }

  // Populate header user badge on content pages
  const headerUserBadge = document.getElementById("headerUserBadge");
  const headerUserName = document.getElementById("headerUserName");
  const headerAvatar = document.getElementById("headerAvatar");
  const logoutBtn = document.getElementById("logoutBtn");

  if (currentUser) {
    if (headerUserBadge) headerUserBadge.style.display = "flex";
    if (headerUserName) headerUserName.textContent = currentUser.name || "Member";
    if (headerAvatar) {
      headerAvatar.textContent = (currentUser.name || "KL").substring(0, 2).toUpperCase();
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("kalalaya_theatre_user");
      showToast("Signed out of Kalalaya Theatre.", "info");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    });
  }

  // =========================================================================
  // 3. AUTH PORTAL (INDEX.HTML) TAB SWITCHING & FORM HANDLERS
  // =========================================================================
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const registerView = document.getElementById("registerView");
  const loginView = document.getElementById("loginView");
  const switchToLoginBtn = document.getElementById("switchToLoginBtn");
  const switchToRegisterBtn = document.getElementById("switchToRegisterBtn");
  const portalToggleBtn = document.getElementById("portalToggleBtn");

  function showRegisterTab() {
    if (registerView && loginView) {
      registerView.style.display = "block";
      loginView.style.display = "none";
    }
    tabRegisterBtn?.classList.add("active");
    tabLoginBtn?.classList.remove("active");
    if (portalToggleBtn) portalToggleBtn.textContent = "Member Log In";
  }

  function showLoginTab() {
    if (registerView && loginView) {
      registerView.style.display = "none";
      loginView.style.display = "block";
    }
    tabLoginBtn?.classList.add("active");
    tabRegisterBtn?.classList.remove("active");
    if (portalToggleBtn) portalToggleBtn.textContent = "Create Account";
    document.getElementById("loginEmail")?.focus();
  }

  tabRegisterBtn?.addEventListener("click", showRegisterTab);
  tabLoginBtn?.addEventListener("click", showLoginTab);
  switchToLoginBtn?.addEventListener("click", showLoginTab);
  switchToRegisterBtn?.addEventListener("click", showRegisterTab);

  if (portalToggleBtn) {
    portalToggleBtn.addEventListener("click", () => {
      if (loginView && loginView.style.display === "block") {
        showRegisterTab();
      } else {
        showLoginTab();
      }
    });
  }

  // --- Registration Form Handler ---
  const regForm = document.getElementById("registrationForm");
  const regStatus = document.getElementById("formStatus");

  const regFields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    interest: document.getElementById("theatreInterest"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms")
  };

  const regErrors = {
    fullName: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    interest: document.getElementById("interestError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmError"),
    terms: document.getElementById("termsError")
  };

  function setRegError(fieldKey, message) {
    if (regErrors[fieldKey]) {
      regErrors[fieldKey].textContent = message;
    }
  }

  function validateRegistration() {
    let isValid = true;
    Object.keys(regErrors).forEach((key) => setRegError(key, ""));

    const name = regFields.fullName ? regFields.fullName.value.trim() : "";
    const email = regFields.email ? regFields.email.value.trim() : "";
    const interest = regFields.interest ? regFields.interest.value : "";
    const password = regFields.password ? regFields.password.value : "";
    const confirmPassword = regFields.confirmPassword ? regFields.confirmPassword.value : "";
    const termsChecked = regFields.terms ? regFields.terms.checked : false;

    if (name.length < 2) {
      setRegError("fullName", "Please enter your full name.");
      isValid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegError("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!interest) {
      setRegError("interest", "Please select your primary theatre interest.");
      isValid = false;
    }

    if (password.length < 8) {
      setRegError("password", "Password must be at least 8 characters.");
      isValid = false;
    }

    if (confirmPassword !== password || confirmPassword.length === 0) {
      setRegError("confirmPassword", "The passwords do not match.");
      isValid = false;
    }

    if (!termsChecked) {
      setRegError("terms", "Please accept Kalalaya's guidelines.");
      isValid = false;
    }

    return isValid;
  }

  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (regStatus) {
        regStatus.textContent = "";
        regStatus.className = "form-status";
      }

      if (!validateRegistration()) {
        const firstErrorField = Object.entries(regErrors).find(([_, el]) => el && el.textContent.length > 0);
        if (firstErrorField && regFields[firstErrorField[0]]) {
          regFields[firstErrorField[0]].focus();
        }
        return;
      }

      const name = regFields.fullName.value.trim();
      const email = regFields.email.value.trim();
      const interest = regFields.interest ? regFields.interest.value : "patron";

      // Save user session in localStorage
      const userObj = { name, email, interest };
      localStorage.setItem("kalalaya_theatre_user", JSON.stringify(userObj));

      if (regStatus) {
        regStatus.innerHTML = `<strong>✓ Welcome to Kalalaya Theatre, ${name}!</strong> Account created. Entering website...`;
        regStatus.className = "form-status success";
      }

      showToast(`Welcome to Kalalaya, ${name}! Entering website...`, "success");

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1200);
    });

    // Real-time clearance of errors
    Object.entries(regFields).forEach(([key, field]) => {
      if (!field) return;
      if (field.type === "checkbox" || field.tagName === "SELECT") {
        field.addEventListener("change", () => setRegError(key, ""));
      } else {
        field.addEventListener("input", () => {
          setRegError(key, "");
          if (key === "password" && regFields.confirmPassword.value) {
            setRegError("confirmPassword", regFields.confirmPassword.value === field.value ? "" : "The passwords do not match.");
          }
          if (key === "confirmPassword" && field.value) {
            setRegError("confirmPassword", field.value === regFields.password.value ? "" : "The passwords do not match.");
          }
        });
      }
    });
  }

  // --- Member Login Form Handler ---
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginEmailError = document.getElementById("loginEmailError");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const loginStatus = document.getElementById("loginStatus");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      if (loginEmailError) loginEmailError.textContent = "";
      if (loginPasswordError) loginPasswordError.textContent = "";
      if (loginStatus) {
        loginStatus.textContent = "";
        loginStatus.className = "form-status";
      }

      const email = loginEmail ? loginEmail.value.trim() : "";
      const password = loginPassword ? loginPassword.value : "";

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (loginEmailError) loginEmailError.textContent = "Please enter a valid email address.";
        valid = false;
      }

      if (!password) {
        if (loginPasswordError) loginPasswordError.textContent = "Please enter your password.";
        valid = false;
      }

      if (!valid) return;

      const displayName = email.split("@")[0];
      const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      // Save user session in localStorage
      const userObj = { name: capitalized, email };
      localStorage.setItem("kalalaya_theatre_user", JSON.stringify(userObj));

      if (loginStatus) {
        loginStatus.innerHTML = `<strong>✓ Welcome back, ${capitalized}!</strong> Log in successful. Entering website...`;
        loginStatus.className = "form-status success";
      }

      showToast(`Welcome back, ${capitalized}! Entering website...`, "success");

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1200);
    });
  }

  // Background Switcher (on Portal culture panel)
  const bgSwitchLogo = document.getElementById("bgSwitchLogo");
  const bgSwitchCultural = document.getElementById("bgSwitchCultural");
  const cultureBgArt = document.getElementById("cultureBgArt");

  if (bgSwitchLogo && bgSwitchCultural && cultureBgArt) {
    bgSwitchLogo.addEventListener("click", () => {
      bgSwitchLogo.classList.add("active");
      bgSwitchCultural.classList.remove("active");
      cultureBgArt.className = "culture-bg-art mode-logo";
      showToast("Background set to Kalalaya Theatre emblem motif", "info");
    });

    bgSwitchCultural.addEventListener("click", () => {
      bgSwitchCultural.classList.add("active");
      bgSwitchLogo.classList.remove("active");
      cultureBgArt.className = "culture-bg-art mode-cultural";
      showToast("Background set to Nepali cultural stage mask backdrop", "info");
    });
  }

  // Password Visibility Toggles
  document.querySelectorAll(".visibility-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.textContent = isPassword ? "⊘" : "◉";
      btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });

  // =========================================================================
  // 4. HEADER SCROLL & MOBILE NAVIGATION
  // =========================================================================
  const siteHeader = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add("scrolled");
    } else {
      siteHeader?.classList.remove("scrolled");
    }
  }, { passive: true });

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================================================================
  // 5. TICKET RESERVATION MODAL LOGIC
  // =========================================================================
  const ticketModal = document.getElementById("ticketModal");
  const ticketModalCloseBtn = document.getElementById("ticketModalCloseBtn");
  const ticketBookingForm = document.getElementById("ticketBookingForm");
  const ticketPlaySelect = document.getElementById("ticketPlaySelect");
  const ticketDateInput = document.getElementById("ticketDate");
  const ticketDateError = document.getElementById("ticketDateError");
  const ticketNameInput = document.getElementById("ticketName");
  const ticketNameError = document.getElementById("ticketNameError");
  const ticketPhoneInput = document.getElementById("ticketPhone");
  const ticketPhoneError = document.getElementById("ticketPhoneError");
  const ticketStatus = document.getElementById("ticketStatus");

  if (ticketDateInput) {
    const today = new Date().toISOString().split("T")[0];
    ticketDateInput.min = today;
    ticketDateInput.value = today;
  }

  function openTicketModal(playName = null) {
    if (!ticketModal) return;
    ticketModal.classList.add("active");
    if (playName && ticketPlaySelect) {
      for (let option of ticketPlaySelect.options) {
        if (option.value.includes(playName) || playName.includes(option.value)) {
          ticketPlaySelect.value = option.value;
          break;
        }
      }
    }
    if (ticketStatus) {
      ticketStatus.textContent = "";
      ticketStatus.className = "form-status";
    }
    if (currentUser && ticketNameInput && !ticketNameInput.value) {
      ticketNameInput.value = currentUser.name || "";
    }
  }

  function closeTicketModal() {
    if (!ticketModal) return;
    ticketModal.classList.remove("active");
  }

  document.getElementById("headerTicketBtn")?.addEventListener("click", () => openTicketModal());
  document.getElementById("heroBookBtn")?.addEventListener("click", () => openTicketModal());
  if (ticketModalCloseBtn) ticketModalCloseBtn.addEventListener("click", closeTicketModal);

  document.querySelectorAll(".play-book-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const playTitle = btn.dataset.play || "";
      openTicketModal(playTitle);
    });
  });

  if (ticketBookingForm) {
    ticketBookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      if (ticketDateError) ticketDateError.textContent = "";
      if (ticketNameError) ticketNameError.textContent = "";
      if (ticketPhoneError) ticketPhoneError.textContent = "";
      if (ticketStatus) {
        ticketStatus.textContent = "";
        ticketStatus.className = "form-status";
      }

      const date = ticketDateInput ? ticketDateInput.value : "";
      const name = ticketNameInput ? ticketNameInput.value.trim() : "";
      const phone = ticketPhoneInput ? ticketPhoneInput.value.trim() : "";
      const play = ticketPlaySelect ? ticketPlaySelect.value : "Theatre Play";
      const seats = document.getElementById("ticketSeats")?.value || "2";

      if (!date) {
        if (ticketDateError) ticketDateError.textContent = "Please pick a show date.";
        valid = false;
      }
      if (name.length < 2) {
        if (ticketNameError) ticketNameError.textContent = "Please enter your name.";
        valid = false;
      }
      if (phone.length < 7) {
        if (ticketPhoneError) ticketPhoneError.textContent = "Please enter a valid phone number.";
        valid = false;
      }

      if (!valid) return;

      if (ticketStatus) {
        ticketStatus.innerHTML = `<strong>✓ Reservation Confirmed!</strong> ${seats} seat(s) for <em>${play}</em> on ${date}. Confirmation SMS sent to ${phone}.`;
        ticketStatus.className = "form-status success";
      }

      showToast(`Reserved ${seats} seat(s) for ${play}!`, "success");

      setTimeout(() => {
        closeTicketModal();
      }, 2400);
    });
  }

  // =========================================================================
  // 6. GALLERY FILTER & LIGHTBOX MODAL (GALLERY.HTML)
  // =========================================================================
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxCounter = document.getElementById("lightboxCounter");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        if (filter === "all" || item.dataset.category === filter) {
          item.style.display = "block";
          requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          });
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";
          setTimeout(() => {
            if (btn.classList.contains("active") && filter !== "all" && item.dataset.category !== filter) {
              item.style.display = "none";
            }
          }, 250);
        }
      });
    });
  });

  let currentVisibleIndex = 0;

  function getVisibleGalleryItems() {
    return Array.from(galleryItems).filter((item) => item.style.display !== "none");
  }

  function showLightboxIndex(index) {
    const visible = getVisibleGalleryItems();
    if (visible.length === 0) return;
    if (index < 0) index = visible.length - 1;
    if (index >= visible.length) index = 0;
    currentVisibleIndex = index;

    const item = visible[currentVisibleIndex];
    const imgSrc = item.dataset.src || item.querySelector("img")?.src || "";
    const title = item.dataset.title || "";
    const desc = item.dataset.desc || "";

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCounter) lightboxCounter.textContent = `Photo ${currentVisibleIndex + 1} of ${visible.length}`;
  }

  function openLightbox(item) {
    if (!lightbox) return;
    const visible = getVisibleGalleryItems();
    const index = visible.indexOf(item);
    showLightboxIndex(index !== -1 ? index : 0);
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
  }

  galleryItems.forEach((item) => {
    const zoomBtn = item.querySelector(".gallery-zoom-btn");
    zoomBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(item);
    });

    item.addEventListener("click", (e) => {
      if (e.target.closest(".slot-swap-btn")) return;
      openLightbox(item);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", () => showLightboxIndex(currentVisibleIndex - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", () => showLightboxIndex(currentVisibleIndex + 1));

  // =========================================================================
  // 7. BLOG ESSAYS FULL ARTICLE MODAL (BLOG.HTML)
  // =========================================================================
  const articleModal = document.getElementById("articleModal");
  const articleModalCloseBtn = document.getElementById("articleModalCloseBtn");
  const articleHeroImg = document.getElementById("articleHeroImg");
  const articleCategory = document.getElementById("articleCategory");
  const articleTime = document.getElementById("articleTime");
  const articleModalTitle = document.getElementById("articleModalTitle");
  const articleAuthor = document.getElementById("articleAuthor");
  const articleFullText = document.getElementById("articleFullText");

  const blogArticlesData = {
    "post-1": {
      category: "Acting Technique",
      readTime: "5 min read",
      title: "The Sacred Silence: Mastering Pauses & Subtext in Nepali Theatre",
      author: "By Kalalaya Acting Master • October 2026",
      image: "images/theatre_monologue.jpg",
      content: `
        <p>In contemporary dramatic arts, dialogue is often misunderstood as the primary driver of theatrical action. Yet, on the living stage, spoken words are merely the visible crest of a vast psychological ocean.</p>
        <blockquote>"An amateur actor fears silence and rushes to fill it. A master actor welcomes silence, allowing the entire auditorium to lean forward in anticipation."</blockquote>
        <p>At Kalalaya Theatre, our daily physical training begins not with vocal projection, but with stillness. We teach actors that every pause must possess weight, intention, and breath. When two actors share an unbroken gaze across a dimly lit stage, the tension generated in the space between their lines carries more truth than a thousand articulated sentences.</p>
        <p>In Nepali folk and proscenium theatre, silence also connects deeply to cultural restraint — the unspoken griefs, the unconfessed yearnings, and the dignity of enduring without exclamation. In our current productions, silence is choreographed with the same mathematical precision as any monologue.</p>
      `
    },
    "post-2": {
      category: "Directing & Dramaturgy",
      readTime: "7 min read",
      title: "From Script to Spotlight: The Directorial Vision Behind 'Kharani'",
      author: "By Resident Stage Director • September 2026",
      image: "images/play_kharani.jpg",
      content: `
        <p>When the original draft of <em>Kharani</em> arrived in our rehearsal room, it carried a raw emotional voltage. Our central question as directors was immediate: How do we translate this intense social friction into an unforgettable visual and acoustic reality?</p>
        <blockquote>"Kharani is not a sermon; it is a ritual of reckoning. The dust and ashes on stage are not props — they represent the residue of human regret."</blockquote>
        <p>We eliminated elaborate traditional scenery. Instead, we chose a stark black box environment framed by rough wooden textures and warm amber lighting. By stripping away extraneous theatrical ornament, we forced the spectator’s focus directly onto the sweat, trembling hands, and moral dilemmas of the ensemble.</p>
        <p>The feedback from our audiences across Kathmandu has affirmed our belief: audiences crave genuine, uncompromising drama that speaks frankly to their deepest experiences.</p>
      `
    },
    "post-3": {
      category: "Scenography & Lights",
      readTime: "4 min read",
      title: "Sculpting with Shadows: How Amber and Cold Blue Tell Stories on Stage",
      author: "By Lighting Scenographer • August 2026",
      image: "images/hero_theatre_stage.jpg",
      content: `
        <p>Lighting in theatre is never simply about making the actors visible. If visibility was all that mattered, we would flood the stage with fluorescent bulbs. The true art of stage lighting lies in deciding what to conceal.</p>
        <blockquote>"A well-placed shadow gives the actor permission to whisper."</blockquote>
        <p>In Kalalaya's productions, our lighting palette relies heavily on warm amber (representing memory, hearth, domesticity, and vulnerability) contrasted with cold blue and sharp silhouettes (representing detachment, bureaucratic cruelty, or solitary grief). By modulating beam angles and color temperature, we sculpt the stage into an emotional landscape.</p>
      `
    },
    "post-4": {
      category: "Ensemble Life",
      readTime: "6 min read",
      title: "The Crucible of the Rehearsal Room: 6 Weeks of Voice & Movement",
      author: "By Ensemble Member • August 2026",
      image: "images/theatre_workshop.jpg",
      content: `
        <p>Six weeks before opening night, our rehearsal hall at 7:00 AM echoes with deep diaphragm breathing, resonant chanting, and biomechanical physical conditioning. To outsiders, it might look like athletic training, but in truth, it is the forging of an ensemble soul.</p>
        <blockquote>"A theatre troupe is not a collection of soloists; it is a single organism breathing through multiple bodies."</blockquote>
        <p>We work through fatigue, creative doubts, and difficult character blocks. By the time the stage manager calls "Places for Act One!", every actor knows not only their own cues, but the exact heartbeat and rhythm of their fellow actors across the stage.</p>
      `
    }
  };

  function openArticle(postId) {
    const data = blogArticlesData[postId];
    if (!data || !articleModal) return;

    if (articleHeroImg) articleHeroImg.src = data.image;
    if (articleCategory) articleCategory.textContent = data.category;
    if (articleTime) articleTime.textContent = data.readTime;
    if (articleModalTitle) articleModalTitle.textContent = data.title;
    if (articleAuthor) articleAuthor.textContent = data.author;
    if (articleFullText) articleFullText.innerHTML = data.content;

    articleModal.classList.add("active");
  }

  function closeArticle() {
    if (!articleModal) return;
    articleModal.classList.remove("active");
  }

  document.querySelectorAll(".read-article-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.postId || "post-1";
      openArticle(postId);
    });
  });

  if (articleModalCloseBtn) articleModalCloseBtn.addEventListener("click", closeArticle);

  // =========================================================================
  // 8. CONTACT FORM INTERACTION (CONTACT.HTML)
  // =========================================================================
  const contactForm = document.getElementById("contactForm");
  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactCategory = document.getElementById("contactCategory");
  const contactMessage = document.getElementById("contactMessage");
  const contactFeedback = document.getElementById("contactFeedback");

  const contactErrors = {
    name: document.getElementById("contactNameError"),
    email: document.getElementById("contactEmailError"),
    category: document.getElementById("contactCategoryError"),
    message: document.getElementById("contactMessageError")
  };

  if (currentUser && contactName && !contactName.value) {
    contactName.value = currentUser.name || "";
  }
  if (currentUser && contactEmail && !contactEmail.value) {
    contactEmail.value = currentUser.email || "";
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      Object.values(contactErrors).forEach((err) => {
        if (err) err.textContent = "";
      });
      if (contactFeedback) {
        contactFeedback.textContent = "";
        contactFeedback.className = "form-feedback";
      }

      const name = contactName ? contactName.value.trim() : "";
      const email = contactEmail ? contactEmail.value.trim() : "";
      const cat = contactCategory ? contactCategory.value : "";
      const msg = contactMessage ? contactMessage.value.trim() : "";

      if (name.length < 2) {
        if (contactErrors.name) contactErrors.name.textContent = "Please enter your full name.";
        valid = false;
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (contactErrors.email) contactErrors.email.textContent = "Please enter a valid email address.";
        valid = false;
      }

      if (!cat) {
        if (contactErrors.category) contactErrors.category.textContent = "Please select an inquiry category.";
        valid = false;
      }

      if (msg.length < 10) {
        if (contactErrors.message) contactErrors.message.textContent = "Please provide details in your message (at least 10 characters).";
        valid = false;
      }

      if (!valid) return;

      if (contactFeedback) {
        contactFeedback.innerHTML = `<strong>✓ Message Received, ${name}!</strong> Thank you for reaching out to Kalalaya Theatre. Our box office team will respond to <em>${email}</em> promptly.`;
        contactFeedback.className = "form-feedback success";
      }

      showToast("Theatre inquiry submitted successfully!", "success");
      contactForm.reset();
    });
  }

  // =========================================================================
  // 9. IMAGE SPACE TESTER & UPLOADER MODAL
  // =========================================================================
  const imageUploaderModal = document.getElementById("imageUploaderModal");
  const uploaderCloseBtn = document.getElementById("uploaderCloseBtn");
  const activeSlotBadge = document.getElementById("activeSlotBadge");
  const imageDropZone = document.getElementById("imageDropZone");
  const localImageInput = document.getElementById("localImageInput");
  const presetBtns = document.querySelectorAll(".preset-choice-btn");

  let currentTargetSlotEl = null;

  function openImageHelper(slotId) {
    const slotEl = document.getElementById(slotId);
    if (!slotEl || !imageUploaderModal) return;
    currentTargetSlotEl = slotEl;

    const slotLabel = slotEl.querySelector(".indicator-label")?.textContent || "Theatre Image Space";
    if (activeSlotBadge) {
      activeSlotBadge.textContent = `Selected: ${slotLabel} (${slotId})`;
    }

    imageUploaderModal.classList.add("active");
  }

  function closeImageHelper() {
    if (!imageUploaderModal) return;
    imageUploaderModal.classList.remove("active");
    currentTargetSlotEl = null;
  }

  document.querySelectorAll(".slot-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const slotId = btn.dataset.slotId;
      openImageHelper(slotId);
    });
  });

  if (uploaderCloseBtn) uploaderCloseBtn.addEventListener("click", closeImageHelper);

  function applyImageToCurrentSlot(imageSrcUrl) {
    if (!currentTargetSlotEl) return;
    const imgEl = currentTargetSlotEl.querySelector("img");
    if (imgEl) {
      imgEl.src = imageSrcUrl;
      imgEl.classList.remove("preview-mode");
    }

    const placeholder = currentTargetSlotEl.querySelector(".placeholder-graphic");
    if (placeholder) {
      placeholder.style.display = "none";
    }

    const parentGalleryItem = currentTargetSlotEl.closest(".gallery-item");
    if (parentGalleryItem) {
      parentGalleryItem.dataset.src = imageSrcUrl;
    }

    showToast("Theatre image placed in selected space!", "success");
    closeImageHelper();
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.src;
      if (src) applyImageToCurrentSlot(src);
    });
  });

  if (imageDropZone && localImageInput) {
    imageDropZone.addEventListener("click", () => {
      localImageInput.click();
    });

    imageDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      imageDropZone.classList.add("dragover");
    });

    imageDropZone.addEventListener("dragleave", () => {
      imageDropZone.classList.remove("dragover");
    });

    imageDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      imageDropZone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleLocalFile(e.dataTransfer.files[0]);
      }
    });

    localImageInput.addEventListener("change", () => {
      if (localImageInput.files && localImageInput.files[0]) {
        handleLocalFile(localImageInput.files[0]);
      }
    });
  }

  function handleLocalFile(file) {
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "info");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      applyImageToCurrentSlot(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // =========================================================================
  // 10. GLOBAL MODAL OUTSIDE CLICK & ESC KEY LISTENER
  // =========================================================================
  const allModals = [ticketModal, lightbox, articleModal, imageUploaderModal];

  allModals.forEach((modal) => {
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      allModals.forEach((modal) => {
        if (modal && modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      });
    }

    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "ArrowLeft") showLightboxIndex(currentVisibleIndex - 1);
      if (e.key === "ArrowRight") showLightboxIndex(currentVisibleIndex + 1);
    }
  });
});
