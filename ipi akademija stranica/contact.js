"use strict";

(function () {
  console.log("contact.js loaded!");
  const form = document.getElementById("kontaktForma");
  if (!form) {
    console.error("Forma sa ID 'kontaktForma' nije pronađena!");
    return;
  }

  const ime = document.getElementById("ime");
  const prezime = document.getElementById("prezime");
  const email = document.getElementById("email");
  const telefon = document.getElementById("telefon");
  const poruka = document.getElementById("poruka");

  const errIme = document.getElementById("errIme");
  const errPrezime = document.getElementById("errPrezime");
  const errEmail = document.getElementById("errEmail");
  const errTelefon = document.getElementById("errTelefon");
  const errPoruka = document.getElementById("errPoruka");

  const drzavaHidden = document.getElementById("drzava");
  const pozivniHidden = document.getElementById("pozivni");
  const detekcija = document.getElementById("detekcijaDrzave");
  const nazivDrzave = document.getElementById("nazivDrzave");
  const zastavaDrzave = document.getElementById("zastavaDrzave");
  const uspjeh = document.getElementById("uspjeh");

  console.log("Elements check:");
  console.log("- telefon:", telefon);
  console.log("- detekcija:", detekcija);
  console.log("- nazivDrzave:", nazivDrzave);

  if (!telefon || !detekcija || !nazivDrzave) {
    console.error("Neki potrebni elementi nisu pronađeni!");
    return;
  }

  // Minimalne regex provjere
  const nameRegex = /^[A-Za-zÀ-ž\-'\s]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Prihvatamo +38761111222 ili 0038761111222, dozvoljavamo razmake, crtice i zagrade
  const phoneRegex = /^(\+|00)?[0-9()\s\-]{7,20}$/;

  // Mapa pozivnih brojeva -> drzava i emoji
  // Uzimamo najduzi meč prvog prefiksa
  const countryMap = [
    // Balkans / Ex-Yu
    { code: "387", name: "Bosna i Hercegovina", flag: "🇧🇦" },
    { code: "381", name: "Srbija", flag: "🇷🇸" },
    { code: "385", name: "Hrvatska", flag: "🇭🇷" },
    { code: "382", name: "Crna Gora", flag: "🇲🇪" },
    { code: "389", name: "Sjeverna Makedonija", flag: "🇲🇰" },
    { code: "386", name: "Slovenija", flag: "🇸🇮" },
    // Europe (selection)
    { code: "355", name: "Albanija", flag: "��" },
    { code: "49", name: "Njemačka", flag: "🇩🇪" },
    { code: "43", name: "Austrija", flag: "🇦🇹" },
    { code: "41", name: "Švicarska", flag: "🇨🇭" },
    { code: "39", name: "Italija", flag: "🇮🇹" },
    { code: "33", name: "Francuska", flag: "🇫🇷" },
    { code: "34", name: "Španija", flag: "🇪🇸" },
    { code: "351", name: "Portugal", flag: "🇵🇹" },
    { code: "32", name: "Belgija", flag: "🇧🇪" },
    { code: "31", name: "Nizozemska", flag: "��" },
    { code: "44", name: "Ujedinjeno Kraljevstvo", flag: "🇬🇧" },
    { code: "353", name: "Irska", flag: "🇮🇪" },
    { code: "45", name: "Danska", flag: "🇩🇰" },
    { code: "46", name: "Švedska", flag: "🇸🇪" },
    { code: "47", name: "Norveška", flag: "🇳🇴" },
    { code: "358", name: "Finska", flag: "🇫🇮" },
    { code: "36", name: "Mađarska", flag: "🇭🇺" },
    { code: "420", name: "Češka", flag: "🇨🇿" },
    { code: "421", name: "Slovačka", flag: "🇸🇰" },
    { code: "48", name: "Poljska", flag: "🇵🇱" },
    { code: "40", name: "Rumunija", flag: "🇷🇴" },
    { code: "380", name: "Ukrajina", flag: "🇺🇦" },
    { code: "371", name: "Latvija", flag: "🇱🇻" },
    { code: "372", name: "Estonija", flag: "🇪🇪" },
    { code: "370", name: "Litvanija", flag: "🇱🇹" },
    { code: "30", name: "Grčka", flag: "🇬🇷" },
    { code: "357", name: "Kipar", flag: "🇨🇾" },
    { code: "90", name: "Turska", flag: "🇹🇷" },
    { code: "7", name: "Rusija / Kazakhstan", flag: "🇷🇺" },
    // Americas
    { code: "1", name: "SAD / Kanada", flag: "🇺🇸" },
    { code: "52", name: "Meksiko", flag: "🇲🇽" },
    { code: "51", name: "Peru", flag: "🇵🇪" },
    { code: "57", name: "Kolumbija", flag: "🇨🇴" },
    { code: "54", name: "Argentina", flag: "🇦🇷" },
    { code: "55", name: "Brazil", flag: "🇧🇷" },
    { code: "56", name: "Čile", flag: "🇨🇱" },
    { code: "58", name: "Venezuela", flag: "🇻🇪" },
    // Asia
    { code: "81", name: "Japan", flag: "🇯🇵" },
    { code: "82", name: "Južna Koreja", flag: "🇰🇷" },
    { code: "86", name: "Kina", flag: "🇨🇳" },
    { code: "91", name: "Indija", flag: "🇮🇳" },
    { code: "92", name: "Pakistan", flag: "🇵🇰" },
    { code: "880", name: "Bangladeš", flag: "🇧🇩" },
    { code: "971", name: "UAE", flag: "🇦🇪" },
    { code: "972", name: "Izrael", flag: "🇮🇱" },
    { code: "966", name: "Saudijska Arabija", flag: "🇸🇦" },
    { code: "94", name: "Šri Lanka", flag: "🇱🇰" },
    { code: "95", name: "Mijanmar", flag: "🇲🇲" },
    { code: "62", name: "Indonezija", flag: "🇮🇩" },
    { code: "63", name: "Filipini", flag: "🇵🇭" },
    { code: "60", name: "Malezija", flag: "🇲🇾" },
    { code: "66", name: "Tajland", flag: "🇹🇭" },
    { code: "65", name: "Singapur", flag: "🇸🇬" },
    { code: "93", name: "Afganistan", flag: "🇦🇫" },
    // Africa
    { code: "234", name: "Nigerija", flag: "🇳🇬" },
    { code: "233", name: "Gana", flag: "🇬🇭" },
    { code: "254", name: "Kenija", flag: "🇰🇪" },
    { code: "255", name: "Tanzanija", flag: "🇹🇿" },
    { code: "256", name: "Uganda", flag: "🇺🇬" },
    { code: "27", name: "Južna Afrika", flag: "🇿🇦" },
    { code: "212", name: "Maroko", flag: "🇲🇦" },
    { code: "213", name: "Alžir", flag: "🇩🇿" },
    { code: "216", name: "Tunis", flag: "🇹🇳" },
    { code: "20", name: "Egipat", flag: "🇪🇬" },
    { code: "251", name: "Etiopija", flag: "🇪🇹" },
    { code: "256", name: "Uganda", flag: "🇺🇬" },
    // Oceania
    { code: "61", name: "Australija", flag: "🇦🇺" },
    { code: "64", name: "Novi Zeland", flag: "🇳🇿" },
  ].sort((a, b) => b.code.length - a.code.length); // duzi prefiks prvo

  function sanitizePhone(value) {
    return value.replace(/[^0-9+]/g, "");
  }

  function toE164(raw) {
    let v = raw.trim();
    // Konvertuj 00 prefix u +
    if (v.startsWith("00")) {
      v = "+" + v.slice(2);
    }
    // Ako ne počinje sa + ali ima cifre, dodaj +
    else if (!v.startsWith("+") && /^[1-9]/.test(v)) {
      v = "+" + v;
    }
    // Lokalni format sa 0 na početku (npr. 061) - ne dodavaj +
    // jer ne znamo državu
    return v;
  }

  function detectCountry(raw) {
    const v = toE164(sanitizePhone(raw));
    if (!v.startsWith("+")) return null;
    const digits = v.slice(1);
    for (const entry of countryMap) {
      if (digits.startsWith(entry.code)) {
        return { name: entry.name, flag: entry.flag, code: entry.code };
      }
    }
    return null;
  }

  function showCountry(info) {
    if (info) {
      nazivDrzave.textContent = `${info.flag} ${info.name} (+${info.code})`;
      detekcija.style.display = "block";
      zastavaDrzave.style.display = "none";
      drzavaHidden.value = info.name;
      pozivniHidden.value = `+${info.code}`;
      console.log("✓ Prikazana država:", info.name, info.flag);
    } else {
      nazivDrzave.textContent = "";
      detekcija.style.display = "none";
      drzavaHidden.value = "";
      pozivniHidden.value = "";
      console.log("✗ Država nije detektovana");
    }
  }

  function validate() {
    let ok = true;
    // reset
    [errIme, errPrezime, errEmail, errTelefon, errPoruka].forEach(
      (e) => (e.style.display = "none")
    );

    if (!nameRegex.test(ime.value.trim())) {
      errIme.style.display = "inline";
      ok = false;
    }
    if (!nameRegex.test(prezime.value.trim())) {
      errPrezime.style.display = "inline";
      ok = false;
    }
    if (!emailRegex.test(email.value.trim())) {
      errEmail.style.display = "inline";
      ok = false;
    }
    if (!phoneRegex.test(telefon.value.trim())) {
      errTelefon.style.display = "inline";
      ok = false;
    }
    if (poruka.value.trim().length < 10) {
      errPoruka.style.display = "inline";
      ok = false;
    }

    // detekcija drzave mora postojati za brojeve sa + ili 00 prefiksom
    const info = detectCountry(telefon.value);
    showCountry(info);
    return ok;
  }

  telefon.addEventListener("input", () => {
    const raw = telefon.value;
    console.log("📞 Telefon unos:", raw);
    const info = detectCountry(raw);
    if (info) {
      console.log(
        "🌍 Detektovana država:",
        info.name,
        info.flag,
        "+" + info.code
      );
    }
    showCountry(info);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Sastavi payload za demonstraciju
    const payload = {
      ime: ime.value.trim(),
      prezime: prezime.value.trim(),
      email: email.value.trim(),
      telefon: telefon.value.trim(),
      poruka: poruka.value.trim(),
      drzava: drzavaHidden.value,
      pozivni: pozivniHidden.value,
    };

    console.log("Kontakt forma:", payload);
    uspjeh.style.display = "block";
    // Po potrebi: ovdje biste poslali payload fetch-om na server.
    form.reset();
    showCountry(null);
  });
})();
