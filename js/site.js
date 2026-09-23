(function () {
  var CONTACT_URL = '/api/contact'
  var HOSTING_CLIENT_ID = 'newabbeycars'

  function applyHostingKillSwitch() {
    // Only relevant when hosted under hometolive.net; ignore failures on standalone.
    fetch('/api/hosting-support/status?clientId=' + encodeURIComponent(HOSTING_CLIENT_ID))
      .then(function (res) {
        return res.ok ? res.json() : null
      })
      .then(function (payload) {
        var status = payload && payload.data
        if (!status || !status.homepageDisabled) return
        var main = document.getElementById('site-main')
        if (!main) return
        main.innerHTML =
          '<section><div class="wrap panel"><h2>This homepage is offline</h2><p class="lede">Hosting support has expired. Renew at <a href="https://hometolive.net/hosting-support/subscribe/?clientId=newabbeycars">hosting support</a> to restore the public site.</p></div></section>'
      })
      .catch(function () {})
  }

  applyHostingKillSwitch()

  function $(id) {
    return document.getElementById(id)
  }

  var menuToggle = document.querySelector('.menu-toggle')
  var siteNav = $('site-nav')
  var topbar = document.querySelector('.topbar')
  function closeMenu() {
    if (!menuToggle || !siteNav || !topbar) return
    menuToggle.setAttribute('aria-expanded', 'false')
    topbar.classList.remove('nav-open')
  }
  if (menuToggle && siteNav && topbar) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true'
      menuToggle.setAttribute('aria-expanded', open ? 'false' : 'true')
      topbar.classList.toggle('nav-open', !open)
    })
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu)
    })
    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 1025px)').matches) closeMenu()
    })
  }

  function setMsg(el, ok, text) {
    if (!el) return
    el.className = 'msg ' + (ok ? 'ok' : 'err')
    el.textContent = text
  }

  function setOffice(office, opts) {
    opts = opts || {}
    var tabs = document.querySelectorAll('.office-tab')
    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-office') === office
      tab.classList.toggle('is-active', active)
      tab.setAttribute('aria-selected', active ? 'true' : 'false')
    })

    document.querySelectorAll('[data-office-panel]').forEach(function (panel) {
      var kind = panel.getAttribute('data-office-panel')
      var show = office === 'both' || office === kind
      if (show) panel.removeAttribute('hidden')
      else panel.setAttribute('hidden', '')
    })

    if (!opts.skipForm) {
      var map = { tires: 'tire', cars: 'ride', both: 'both' }
      var value = map[office] || 'tire'
      var radio = document.querySelector('input[name="service"][value="' + value + '"]')
      if (radio) radio.checked = true
    }

    if (opts.scroll) {
      var target =
        office === 'cars'
          ? document.getElementById('abbey-cars')
          : office === 'tires'
            ? document.getElementById('abbey-tires')
            : document.getElementById('brands-stage')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  document.querySelectorAll('.office-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      setOffice(tab.getAttribute('data-office'), { scroll: true })
    })
  })

  document.querySelectorAll('input[name="service"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var office =
        radio.value === 'ride' ? 'cars' : radio.value === 'tire' ? 'tires' : 'both'
      setOffice(office, { skipForm: true })
    })
  })

  // Default: Tyres office (matches Loveable mobile jump + default form)
  setOffice('tires', { skipForm: true })

  var notifyForm = $('notify-form')
  if (notifyForm) {
    notifyForm.addEventListener('submit', function (event) {
      event.preventDefault()
      var msg = $('notify-msg')
      var btn = notifyForm.querySelector('button')
      var company = notifyForm.company.value.trim()
      if (company) {
        setMsg(msg, true, 'Thanks — we will be in touch.')
        notifyForm.reset()
        return
      }
      var name = notifyForm.name.value.trim()
      var email = notifyForm.email.value.trim()
      var phone = notifyForm.phone.value.trim()
      var serviceEl = notifyForm.querySelector('input[name="service"]:checked')
      var service = serviceEl ? serviceEl.value : ''
      var when = notifyForm.when.value.trim()
      var request = notifyForm.request.value.trim()
      if (!service) {
        setMsg(msg, false, 'Please choose a ride, tire service, or both.')
        return
      }
      if (!phone) {
        setMsg(msg, false, 'Please add your phone number.')
        return
      }
      if (!when) {
        setMsg(msg, false, 'Please choose a date and time.')
        return
      }
      if (!name) name = phone || 'Website enquiry'
      // Contact API expects an email field; phone-first bookings may omit it.
      if (!email) email = 'noreply@hometolive.com'
      var serviceLabel = service === 'ride' ? 'a ride' : service === 'tire' ? 'tire service' : 'a ride and tire service'
      btn.disabled = true
      fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          subject: 'New Abbey Cars — ' + serviceLabel,
          message:
            'Booking from the Abbey Cars site. Service: ' +
            serviceLabel +
            '. When: ' +
            when +
            '. Phone: ' +
            phone +
            '. Email given: ' +
            (notifyForm.email.value.trim() || 'not given') +
            '. Special request: ' +
            (request || 'none') +
            '. Coverage: E1-E18 and surrounding areas.',
          company: '',
          website: '',
        }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { res: res, data: data }
          })
        })
        .then(function (result) {
          if (result.res.ok) {
            setMsg(msg, true, result.data.message || 'Thanks — we will be in touch.')
            notifyForm.reset()
            notifyForm.name.value = 'Website enquiry'
            setOffice('tires')
            return
          }
          setMsg(msg, false, result.data.error || 'Could not send just now. Please call instead.')
        })
        .catch(function () {
          setMsg(msg, false, 'Network error. Please call 020 8073 4444.')
        })
        .finally(function () {
          btn.disabled = false
        })
    })
  }
})()
