import {
  AuditProgram,
  Temuan,
  RiskItem,
  QAInspection,
  EvaluasiBarangJasa,
  PersonelPPHP,
  SuratTugasPPHP,
  KnowledgeItem,
  NotifikasiAlert
} from '../types';

export const initialPrograms: AuditProgram[] = [
  {
    id: 'PRG-01',
    nomor: 'PKPT/2026/01/001',
    tahun: 2026,
    tipe: 'PKPT',
    judul: 'Audit Kelaikan Konstruksi Jembatan Akses Tol Segmen IV',
    objek: 'Konstruksi',
    unitKerja: 'Divisi Teknik & Konstruksi Infrastruktur',
    lokasi: 'Kabupaten Tangerang, Banten',
    supervisor: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
    ketuaTim: 'Ahmad Fauzan, S.T., CISA',
    anggotaTim: ['Rina Kusuma, S.T.', 'Dimas Prasetyo, S.T.'],
    anggaran: 285000000,
    jadwalMulai: '2026-02-01',
    jadwalSelesai: '2026-03-15',
    status: 'Berjalan',
    progressPercent: 78,
    jumlahTemuan: 3,
    uraianTugas: 'Pemeriksaan kepatuhan mutu beton K-450, toleransi lendutan girder, serta pengujian NDT pile cap.'
  },
  {
    id: 'PRG-02',
    nomor: 'PKPT/2026/01/002',
    tahun: 2026,
    tipe: 'PKPT',
    judul: 'Pengawasan Pengadaan Transformator Daya 60 MVA Gardu Induk',
    objek: 'Pengadaan',
    unitKerja: 'Divisi Pengadaan Barang & Jasa Strategis',
    lokasi: 'Semarang, Jawa Tengah',
    supervisor: 'Ir. Bambang Trihadi, M.T.',
    ketuaTim: 'Hendra Gunawan, S.T., IPM',
    anggotaTim: ['Siti Aminah, M.Eng.', 'Budi Santoso, S.T.'],
    anggaran: 195000000,
    jadwalMulai: '2026-01-10',
    jadwalSelesai: '2026-02-28',
    status: 'Selesai',
    progressPercent: 100,
    jumlahTemuan: 2,
    uraianTugas: 'Evaluasi kepatuhan spesifikasi teknis IEC 60076, uji factory acceptance test (FAT), dan asuransi pengiriman.'
  },
  {
    id: 'PRG-03',
    nomor: 'PKPT/2026/02/003',
    tahun: 2026,
    tipe: 'PKPT',
    judul: 'Audit Pemeliharaan Berkala Turbin Pembangkit Blok 2',
    objek: 'Pemeliharaan',
    unitKerja: 'Unit Pembangkitan Energi Barat',
    lokasi: 'Cilegon, Banten',
    supervisor: 'Ir. Bambang Trihadi, M.T.',
    ketuaTim: 'Dedi Irawan, S.T.',
    anggotaTim: ['Wahyudi, S.T.', 'Teguh Prabowo, A.Md.'],
    anggaran: 220000000,
    jadwalMulai: '2026-03-01',
    jadwalSelesai: '2026-04-10',
    status: 'Berjalan',
    progressPercent: 45,
    jumlahTemuan: 2,
    uraianTugas: 'Verifikasi pergantian bearing, clearance rotor blade, dan kepatuhan SOP predictive maintenance.'
  },
  {
    id: 'PRG-04',
    nomor: 'NON-PKPT/2026/03/001',
    tahun: 2026,
    tipe: 'Non-PKPT',
    judul: 'Pemeriksaan Khusus (Investigasi) Retak Dinding Penahan Tanah',
    objek: 'Proyek',
    unitKerja: 'Divisi Proyek Regional III',
    lokasi: 'Sumedang, Jawa Barat',
    supervisor: 'Ir. Bambang Trihadi, M.T.',
    ketuaTim: 'Ahmad Fauzan, S.T., CISA',
    anggotaTim: ['Rina Kusuma, S.T.'],
    anggaran: 85000000,
    jadwalMulai: '2026-03-10',
    jadwalSelesai: '2026-03-25',
    status: 'Berjalan',
    progressPercent: 60,
    jumlahTemuan: 1,
    uraianTugas: 'Investigasi amblesan timbunan tanah dan retak struktural retaining wall STA 42+200 akibat sistem drainase lereng.'
  },
  {
    id: 'PRG-05',
    nomor: 'PKPT/2026/02/004',
    tahun: 2026,
    tipe: 'PKPT',
    judul: 'Evaluasi Operasional Sistem SCADA dan Proteksi Otomasi',
    objek: 'Operasional',
    unitKerja: 'Divisi Sistem Informasi & Otomasi Pabrik',
    lokasi: 'Kantor Operasional Jakarta',
    supervisor: 'Ir. Bambang Trihadi, M.T.',
    ketuaTim: 'Hendra Gunawan, S.T., IPM',
    anggotaTim: ['Dimas Prasetyo, S.T.'],
    anggaran: 140000000,
    jadwalMulai: '2026-04-01',
    jadwalSelesai: '2026-05-15',
    status: 'Draft',
    progressPercent: 0,
    jumlahTemuan: 0,
    uraianTugas: 'Pengawasan keandalan telekomunikasi RTU, redundansi server kontrol, dan cyber-security teknik industri.'
  }
];

export const initialTemuan: Temuan[] = [
  {
    id: 'TMN-01',
    nomorTemuan: 'TMN/2026/02/001',
    programId: 'PRG-01',
    programJudul: 'Audit Kelaikan Konstruksi Jembatan Akses Tol Segmen IV',
    tanggal: '2026-02-18',
    unitKerja: 'Divisi Teknik & Konstruksi Infrastruktur',
    kategori: 'Mutu',
    kondisi: 'Terdapat deviasi nilai slump beton pada pengecoran Pier Head P-14 sebesar 16 cm (kriteria toleransi RKS: 10 ± 2 cm). Hasil uji hammer test menunjukkan indikasi variasi kuat tekan setempat pada zona sisi timur.',
    kriteria: 'Spesifikasi Umum Bina Marga 2020 Divisi 7 (Struktur Beton Mutu Tinggi) Pasal 7.1.3 dan Rencana Kerja Syarat (RKS) Kontrak.',
    sebab: 'Pencampuran air berlebih di batching plant saat transit truk mixer karena keterlambatan pengiriman tanpa persetujuan Quality Inspector konsultan pengawas.',
    akibat: 'Potensi penurunan durabilitas struktural jangka panjang dan risiko honeycomb pada tulangan rapat pier head.',
    nilaiRisiko: 'Tinggi',
    estimasiKerugian: 145000000,
    buktiFoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
    buktiKeterangan: 'Foto dokumentasi uji slump di lokasi pier head P-14 dan core drill titik sampel 2.',
    statusApprovalSupervisor: 'Disetujui',
    rekomendasiList: [
      {
        id: 'REK-01',
        nomor: 'REK/2026/02/001-A',
        uraian: 'Menginstruksikan kontraktor utama melakukan uji Core Drill independen terakreditasi KAN pada titik P-14 sisi timur untuk validasi nilai kuat tekan karakteristik aktual.',
        pic: 'Ir. Suhendra (PPK Divisi Konstruksi)',
        targetSelesai: '2026-03-20',
        prioritas: 'Tinggi',
        status: 'Progress',
        catatanSupervisor: 'Harus disaksikan oleh Auditor Teknik dan Konsultan MK.'
      },
      {
        id: 'REK-02',
        nomor: 'REK/2026/02/001-B',
        uraian: 'Menerapkan sistem checklist batching plant dengan automatic moisture sensor dan barcode verifikasi keberangkatan truk mixer.',
        pic: 'Manager QA/QC Kontraktor Pelaksana',
        targetSelesai: '2026-03-31',
        prioritas: 'Sedang',
        status: 'Open',
        catatanSupervisor: 'Pastikan SOP QA diperbarui dan disosialisasikan ke tim lapangan.'
      }
    ]
  },
  {
    id: 'TMN-02',
    nomorTemuan: 'TMN/2026/02/002',
    programId: 'PRG-01',
    programJudul: 'Audit Kelaikan Konstruksi Jembatan Akses Tol Segmen IV',
    tanggal: '2026-02-22',
    unitKerja: 'Divisi Teknik & Konstruksi Infrastruktur',
    kategori: 'Administratif',
    kondisi: 'As-Built Drawing untuk struktur fondasi bore pile pilar P-10 s.d P-13 belum dimutakhirkan dengan catatan deviasi koordinat pengeboran aktual dari tim surveyor.',
    kriteria: 'SOP-SPI-TEK-04 tentang Penatausahaan Gambar Kerja dan Dokumentasi Hasil Pengawasan.',
    sebab: 'Tim teknis lapangan belum menyelesaikan rekonsiliasi data ukur total station kontraktor dan konsultan supervisi.',
    akibat: 'Kesulitan tracing utilitas dan validasi beban bila terjadi deformasi di masa pemeliharaan.',
    nilaiRisiko: 'Sedang',
    estimasiKerugian: 0,
    buktiFoto: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    buktiKeterangan: 'Lembar gambar kerja revisi belum ada paraf pengendali mutu dan belum tersimpan di CDE.',
    statusApprovalSupervisor: 'Disetujui',
    rekomendasiList: [
      {
        id: 'REK-03',
        nomor: 'REK/2026/02/002-A',
        uraian: 'Menyelesaikan pemutakhiran As-Built Drawing dan mengunggah ke portal Common Data Environment (CDE) berparaf lengkap.',
        pic: 'Kepala Bagian Engineering Proyek',
        targetSelesai: '2026-03-10',
        prioritas: 'Sedang',
        status: 'Verifikasi',
        catatanSupervisor: 'Telah diajukan bukti perbaikan, sedang ditinjau Auditor Staf.',
        tindakLanjut: {
          uraian: 'Telah diterbitkan As-Built Drawing Rev 02 bernomor ABD-JMB-2026-P10-13 dengan paraf lengkap Konsultan MK dan PPK, file PDF telah diupload ke sistem CDE internal.',
          tanggalSubmit: '2026-03-08',
          submittedBy: 'Raditya Arya (Engineering Staff)',
          buktiFile: 'ABD_Rev02_P10_P13_Signed.pdf',
          buktiNama: 'Dokumen Gambar As-Built Disahkan Konsultan',
          catatanAuditor: 'Gambar telah diperiksa sesuai data koordinat lapangan, siap penutupan oleh Supervisor.'
        }
      }
    ]
  },
  {
    id: 'TMN-03',
    nomorTemuan: 'TMN/2026/02/003',
    programId: 'PRG-02',
    programJudul: 'Pengawasan Pengadaan Transformator Daya 60 MVA Gardu Induk',
    tanggal: '2026-02-15',
    unitKerja: 'Divisi Pengadaan Barang & Jasa Strategis',
    kategori: 'Kepatuhan',
    kondisi: 'Penyedia jasa belum menyertakan sertifikat kalibrasi sensor gas dissolved DGA (Dissolved Gas Analysis) dari pabrikan asli saat serah terima barang.',
    kriteria: 'Spesifikasi Kontrak Pengadaan Bagian Teknis Sub-pasal 12.4 tentang Instrumentasi Monitoring Online Trafo.',
    sebab: 'Kurang cermatnya verifikasi dokumen kelengkapan oleh panitia penerima saat unboxing di gudang transit.',
    akibat: 'Garansi pemantauan dini kegagalan isolasi minyak trafo tidak dapat dijamin secara legal bila terjadi insiden operasi.',
    nilaiRisiko: 'Tinggi',
    estimasiKerugian: 80000000,
    buktiFoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    buktiKeterangan: 'Foto lemari panel kontrol trafo tanpa sertifikat traceable kalibrasi pabrikan.',
    statusApprovalSupervisor: 'Disetujui',
    rekomendasiList: [
      {
        id: 'REK-04',
        nomor: 'REK/2026/02/003-A',
        uraian: 'Menahan pencairan termin 10% s.d pabrikan menerbitkan sertifikat kalibrasi resmi yang teregistrasi secara internasional.',
        pic: 'Pejabat Pembuat Komitmen (PPK)',
        targetSelesai: '2026-03-05',
        prioritas: 'Tinggi',
        status: 'Closed',
        catatanSupervisor: 'Sertifikat telah diterima dan divalidasi ke laboratorium penguji Jerman.',
        tindakLanjut: {
          uraian: 'Penyedia telah menyerahkan Sertifikat Kalibrasi Pabrikan Asli No. CAL-DGA-9921 tertanggal 2026-02-28, telah dicek keasliannya melalui portal verifikasi vendor.',
          tanggalSubmit: '2026-03-01',
          submittedBy: 'Budi Santoso (Staff Pengadaan)',
          buktiFile: 'Cert_Calibration_DGA_Trafo_60MVA.pdf',
          buktiNama: 'Original Factory Calibration Certificate',
          catatanAuditor: 'Telah diverifikasi sesuai spesifikasi kontrak.',
          tanggalVerifikasi: '2026-03-03',
          verifiedBy: 'Ir. Bambang Trihadi, M.T.'
        }
      }
    ]
  },
  {
    id: 'TMN-04',
    nomorTemuan: 'TMN/2026/03/004',
    programId: 'PRG-04',
    programJudul: 'Pemeriksaan Khusus Retak Dinding Penahan Tanah',
    tanggal: '2026-03-14',
    unitKerja: 'Divisi Proyek Regional III',
    kategori: 'Teknis',
    kondisi: 'Lubang suling-suling (weep holes) pada retaining wall tersumbat endapan lanau dan tidak dipasang geotextile filter di belakang dinding, menyebabkan akumulasi tekanan hidrostatis air pori.',
    kriteria: 'Pedoman Perencanaan Dinding Penahan Tanah Pd T-08-2005-B Ditjen Bina Marga.',
    sebab: 'Pelaksanaan timbunan drainase porous gravel tidak sesuai metode kerja standar.',
    akibat: 'Gaya dorong lateral melonjak melebihi daya dukung guling aman, memicu retak geser selebar 8 mm sepanjang 12 meter.',
    nilaiRisiko: 'Ekstrem',
    estimasiKerugian: 320000000,
    buktiFoto: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
    buktiKeterangan: 'Foto retak miring geser pada panel DPT STA 42+200 dan genangan air di belakang lereng.',
    statusApprovalSupervisor: 'Disetujui',
    rekomendasiList: [
      {
        id: 'REK-05',
        nomor: 'REK/2026/03/004-A',
        uraian: 'Segera memasang perkuatan darurat (shoring/strutting) baja dan membuat lubang perforasi horizontal drainase baru (subdrain).',
        pic: 'Project Manager Kontraktor & PPK',
        targetSelesai: '2026-03-22',
        prioritas: 'Tinggi',
        status: 'Progress',
        catatanSupervisor: 'Prioritas keselamatan nomor satu. Segera eksekusi sebelum musim hujan puncak.'
      }
    ]
  }
];

export const initialRisks: RiskItem[] = [
  {
    id: 'RSK-01',
    kode: 'RSK-INF-01',
    objekPengawasan: 'Konstruksi Jembatan & Jalan Tol',
    deskripsiRisiko: 'Kegagalan struktural akibat deviasi mutu material beton dan lendutan girder jembatan melampaui batas elastis',
    penyebab: 'Quality control batching plant lemah dan pengawasan supplier agregat tidak konsisten',
    dampak: 'Potensi penutupan jalur lalu lintas, klaim asuransi macet, kerugian reputasi korporasi',
    kemungkinan: 4,
    konsekuensi: 4,
    skorInherent: 16,
    levelRisiko: 'Ekstrem',
    programMitigasi: 'Pemeriksaan rutin NDT 100% balok girder, penempatan supervisor independen di batching plant, audit QA berkala.',
    pic: 'Supervisor Pengawas Teknik & Tim Auditor Konstruksi',
    deadline: '2026-06-30',
    statusMitigasi: 'On Progress',
    residualScore: 8
  },
  {
    id: 'RSK-02',
    kode: 'RSK-PBD-02',
    objekPengawasan: 'Pengadaan Trafo & Switchgear Gardu Induk',
    deskripsiRisiko: 'Keterlambatan serah terima peralatan utama impor dan ketidaksesuaian sertifikasi standar IEC',
    penyebab: 'Rantai pasok global terganggu dan verifikasi klausul FAT (Factory Acceptance Test) terlambat diinisiasi',
    dampak: 'Keterlambatan energizing transmisi, denda keterlambatan proyek strategis',
    kemungkinan: 3,
    konsekuensi: 4,
    skorInherent: 12,
    levelRisiko: 'Tinggi',
    programMitigasi: 'Pemantauan pengiriman mingguan via tele-inspection, percepatan pembentukan tim PPHP terakreditasi.',
    pic: 'Divisi Pengadaan & PPHP',
    deadline: '2026-04-15',
    statusMitigasi: 'On Progress',
    residualScore: 6
  },
  {
    id: 'RSK-03',
    kode: 'RSK-MNT-03',
    objekPengawasan: 'Pemeliharaan Turbin Pembangkit',
    deskripsiRisiko: 'Insiden trip turbin mendadak akibat getaran berlebih (vibration anomaly) pada bantalan poros utama',
    penyebab: 'Penggantian suku cadang pelumas filter melebihi jam operasi batas (overhaul overdue)',
    dampak: 'Blackout pasokan listrik regional dan kerugian downtime operasional hingga miliaran rupiah',
    kemungkinan: 3,
    konsekuensi: 5,
    skorInherent: 15,
    levelRisiko: 'Ekstrem',
    programMitigasi: 'Implementasi vibration monitoring online sensor 24/7 dan penegakan SOP predictive maintenance 2026.',
    pic: 'Divisi Pemeliharaan Aset & Supervisor Teknik',
    deadline: '2026-05-10',
    statusMitigasi: 'Belum Mitigasi',
    residualScore: 10
  },
  {
    id: 'RSK-04',
    kode: 'RSK-OPS-04',
    objekPengawasan: 'Operasional Sistem SCADA & IT Industri',
    deskripsiRisiko: 'Penyusupan siber atau hilangnya sinyal telemetri gardu induk terpencil',
    penyebab: 'Firewall firmware lawas dan tidak adanya autentikasi dua faktor pada jalur VPN teknisi',
    dampak: 'Hilangnya kontrol switching jarak jauh secara temporer',
    kemungkinan: 2,
    konsekuensi: 4,
    skorInherent: 8,
    levelRisiko: 'Sedang',
    programMitigasi: 'Patching berkala, penetapan zero-trust network access, audit keamanan informasi ISO 27001.',
    pic: 'Divisi Otomasi & IT',
    deadline: '2026-08-31',
    statusMitigasi: 'Tuntas Terkendali',
    residualScore: 4
  },
  {
    id: 'RSK-05',
    kode: 'RSK-K3L-05',
    objekPengawasan: 'K3 dan Lingkungan Proyek Konstruksi',
    deskripsiRisiko: 'Insiden kecelakaan kerja pada pekerjaan di ketinggian (erection girder crane)',
    penyebab: 'Operator rigger tidak bersertifikat K3 aktif atau izin kerja lifting permit diabaikan',
    dampak: 'Korban cedera/jiwa, penghentian sementara proyek oleh instansi berwenang',
    kemungkinan: 3,
    konsekuensi: 5,
    skorInherent: 15,
    levelRisiko: 'Ekstrem',
    programMitigasi: 'Pemberlakuan mandatory toolbox meeting, verifikasi SIO alat angkut, inspeksi harian safety officer.',
    pic: 'Satgas K3 Proyek & SPI',
    deadline: '2026-04-30',
    statusMitigasi: 'On Progress',
    residualScore: 6
  },
  {
    id: 'RSK-06',
    kode: 'RSK-ADM-06',
    objekPengawasan: 'Dokumentasi Kontrak dan Berita Acara',
    deskripsiRisiko: 'Ketiadaan backup as-built drawing dan keterlambatan penyusunan Berita Acara Pemeriksaan Pekerjaan (BAPP)',
    penyebab: 'Personel PPHP merangkap banyak penugasan tanpa sistem otomasi surat tugas',
    dampak: 'Audit eksternal BPK menemukan ketidaksesuaian administrasi serah terima',
    kemungkinan: 2,
    konsekuensi: 2,
    skorInherent: 4,
    levelRisiko: 'Rendah',
    programMitigasi: 'Digitalisasi sistem ePTI dengan generator otomatis BAP & Surat Tugas.',
    pic: 'Sekretariat PPHP & Supervisor',
    deadline: '2026-03-31',
    statusMitigasi: 'Tuntas Terkendali',
    residualScore: 2
  }
];

export const initialQAInspections: QAInspection[] = [
  {
    id: 'QA-01',
    nomorQA: 'QA-INSP/2026/02/011',
    paketPekerjaan: 'Pekerjaan Struktur Bawah Jembatan Flyover Segmen 3',
    lokasi: 'Tangerang',
    kontraktor: 'PT Wijaya Sarana Konstruksi',
    jadwalInspeksi: '2026-02-25',
    timInspektur: ['Ir. Bambang Trihadi, M.T.', 'Rina Kusuma, S.T.'],
    status: 'Selesai',
    rating: 'Baik',
    skorRataRata: 84.5,
    ncrCount: 1,
    correctiveActionPlan: 'Perbaikan selimut beton pada kolom K-3 menggunakan mortar non-shrink sebelum penyerahan parsial.',
    checklist: [
      {
        id: 'CK-01',
        standarRef: 'SNI 2847:2019',
        parameter: 'Ketebalan Selimut Beton (Concrete Cover)',
        kriteriaUji: 'Toleransi min 50 mm untuk struktur terbuka',
        hasilUji: 'Sesuai',
        skor: 90,
        keterangan: 'Rata-rata 52 mm terukur dengan rebar locator.'
      },
      {
        id: 'CK-02',
        standarRef: 'ASTM C39',
        parameter: 'Kuat Tekan Beton Karakteristik 28 Hari',
        kriteriaUji: 'f\'c >= 40 MPa',
        hasilUji: 'Sesuai',
        skor: 88,
        keterangan: 'Hasil uji laboratorium independen 41.8 MPa.'
      },
      {
        id: 'CK-03',
        standarRef: 'Permen PUPR No 14/2020',
        parameter: 'Kerapatan Bekisting & Kebocoran Pasta Semen',
        kriteriaUji: 'Tidak ada rongga sarang lebah (honeycomb) > 10 cm²',
        hasilUji: 'Tidak Sesuai',
        skor: 65,
        keterangan: 'Ditemukan rongga kecil di sambungan bekisting pier base kolom K-3.'
      }
    ]
  },
  {
    id: 'QA-02',
    nomorQA: 'QA-INSP/2026/03/014',
    paketPekerjaan: 'Instalasi Sistem Pemipaan Pendingin Turbin Unit 2',
    lokasi: 'Cilegon',
    kontraktor: 'PT Rekayasa Energi Prima',
    jadwalInspeksi: '2026-03-12',
    timInspektur: ['Dedi Irawan, S.T.', 'Ahmad Fauzan, S.T.'],
    status: 'Proses',
    rating: 'Sangat Baik',
    skorRataRata: 92.0,
    ncrCount: 0,
    correctiveActionPlan: 'Mempertahankan standar pengelasan GTAW dan inspeksi radiografi 100%.',
    checklist: [
      {
        id: 'CK-04',
        standarRef: 'ASME B31.1',
        parameter: 'Uji Radiografi Sambungan Las Pipa Tekanan Tinggi',
        kriteriaUji: 'Tidak ada porosity, slag inclusion, atau incomplete penetration',
        hasilUji: 'Sesuai',
        skor: 95,
        keterangan: 'Film radiografi bersih, welder bersertifikasi 6G migas.'
      },
      {
        id: 'CK-05',
        standarRef: 'SOP-QA-PLN-08',
        parameter: 'Uji Tekanan Hidrostatik (Hydrotest)',
        kriteriaUji: '1.5x Tekanan Desain ditahan selama 2 jam tanpa drop tekanan',
        hasilUji: 'Sesuai',
        skor: 90,
        keterangan: 'Tekanan 18 bar stabil selama 120 menit tanpa rembesan.'
      }
    ]
  }
];

export const initialEvaluasiBarangJasa: EvaluasiBarangJasa[] = [
  {
    id: 'EV-01',
    nomorKontrak: 'KTR/PBJ-TEK/2025/11/045',
    namaPaket: 'Pengadaan & Pemasangan 2 Unit Pompa Submersible Debit 500 L/detik',
    penyedia: 'PT Tirta Mandiri Hidro',
    nilaiKontrak: 1850000000,
    tanggalPemeriksaan: '2026-02-28',
    lokasi: 'Stasiun Pompa Banjir Muara Angke',
    volumeKontrak: '2 Unit Lengkap Motor 150 kW & Panel VFD',
    volumeRealisasi: '2 Unit Lengkap Terpasang di Chamber',
    persentaseVolume: 100,
    spesifikasiKesesuaian: 'Sesuai 100%',
    mutuKelaikan: 'Layak',
    statusBA: 'Disetujui Supervisor',
    dokumentasi: {
      foto1: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      foto2: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      drawingRef: 'DWG-PMP-2025-01-REV3',
      asBuiltStatus: 'Tersedia Lengkap'
    },
    catatanEvaluasi: 'Pemeriksaan performa debit aktual menghasilkan 515 L/detik pada head 18 m (memenuhi syarat). Berita Acara Pemeriksaan Fisik disahkan oleh PPHP dan disetujui Supervisor Pengawas Teknik.'
  },
  {
    id: 'EV-02',
    nomorKontrak: 'KTR/PBJ-KONST/2025/12/089',
    namaPaket: 'Rehabilitasi Saluran Drainase Primer Sta 12 s.d 15 Beton Precast U-Ditch',
    penyedia: 'CV Bina Graha Perkasa',
    nilaiKontrak: 920000000,
    tanggalPemeriksaan: '2026-03-08',
    lokasi: 'Kawasan Industri Cikarang',
    volumeKontrak: 'Panjang 3.000 Meter U-Ditch 120x120 + Cover Plat',
    volumeRealisasi: 'Panjang 2.940 Meter Terpasang, 60 Meter Dalam Proses Finishing',
    persentaseVolume: 98,
    spesifikasiKesesuaian: 'Deviasi Minor',
    mutuKelaikan: 'Layak dengan Catatan',
    statusBA: 'Diverifikasi PPHP',
    dokumentasi: {
      foto1: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
      foto2: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
      drawingRef: 'DWG-DRN-2025-UDITCH-120',
      asBuiltStatus: 'Belum Lengkap'
    },
    catatanEvaluasi: 'Perlu perapian 60 m sisa penutup dan penyemenan nat spesi antar beton precast sebelum BAP diterbitkan.'
  }
];

export const initialPPHP: PersonelPPHP[] = [
  {
    id: 'PHP-01',
    nip: '19790512 200501 1 004',
    nama: 'Ir. Agus Wijanarko, S.T., IPU',
    jabatan: 'Ahli Madya Teknik Konstruksi & Pengadaan',
    unitAsal: 'Direktorat Pengawasan Teknis',
    sertifikasi: ['Sertifikasi Keahlian PBJ LKPP Tk. 2', 'Ahli Utama K3 Konstruksi (BNSP)', 'Auditor Teknis SPI'],
    bebanKerjaAktif: 2,
    statusKetersediaan: 'Siap Tugas',
    totalPenugasanSelesai: 34,
    kontak: '0812-9844-3321'
  },
  {
    id: 'PHP-02',
    nip: '19841103 200803 2 001',
    nama: 'Dewi Lestari, S.T., M.T.',
    jabatan: 'Koordinator Verifikasi Mutu Mekanikal & Elektrikal',
    unitAsal: 'Divisi Pemeliharaan Aset',
    sertifikasi: ['PBJ Ahli Pengadaan Nasional', 'Certified Reliability Engineer (CRE)', 'Uji NDT Level II'],
    bebanKerjaAktif: 3,
    statusKetersediaan: 'Sedang Bertugas',
    totalPenugasanSelesai: 28,
    kontak: '0813-8821-4455'
  },
  {
    id: 'PHP-03',
    nip: '19890218 201201 1 008',
    nama: 'Eko Prasetyo, S.T.',
    jabatan: 'Staf Peneliti Fisik Sipil & Infrastruktur',
    unitAsal: 'Balai Uji Laboratorium Teknik',
    sertifikasi: ['Sertifikat PBJ Dasar LKPP', 'Ahli Geoteknik Muda HATTI'],
    bebanKerjaAktif: 1,
    statusKetersediaan: 'Siap Tugas',
    totalPenugasanSelesai: 19,
    kontak: '0857-3312-9011'
  },
  {
    id: 'PHP-04',
    nip: '19910725 201402 1 002',
    nama: 'Muhammad Yusuf, S.T.',
    jabatan: 'Pemeriksa Spesifikasi Instrumentasi & SCADA',
    unitAsal: 'Divisi Teknologi Informasi',
    sertifikasi: ['PBJ Level 1', 'CISA (Certified Information Systems Auditor)'],
    bebanKerjaAktif: 4,
    statusKetersediaan: 'Sedang Bertugas',
    totalPenugasanSelesai: 22,
    kontak: '0819-0412-8877'
  }
];

export const initialSuratTugas: SuratTugasPPHP[] = [
  {
    id: 'ST-01',
    nomorST: 'ST-PPHP/2026/02/088',
    tanggalST: '2026-02-24',
    namaPekerjaan: 'Pemeriksaan Hasil Pekerjaan Pengadaan 2 Unit Pompa Submersible Muara Angke',
    lokasi: 'Jakarta Utara',
    personelIds: ['PHP-01', 'PHP-02'],
    tanggalMulai: '2026-02-26',
    tanggalSelesai: '2026-02-28',
    ditandatanganiOleh: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
    status: 'Selesai'
  },
  {
    id: 'ST-02',
    nomorST: 'ST-PPHP/2026/03/095',
    tanggalST: '2026-03-05',
    namaPekerjaan: 'Pemeriksaan Fisik Proyek Drainase U-Ditch 120 Cikarang',
    lokasi: 'Bekasi - Cikarang',
    personelIds: ['PHP-01', 'PHP-03'],
    tanggalMulai: '2026-03-07',
    tanggalSelesai: '2026-03-12',
    ditandatanganiOleh: 'Ir. Bambang Trihadi, M.T. (Supervisor Pengawas Teknik)',
    status: 'Diterbitkan'
  }
];

export const initialKnowledge: KnowledgeItem[] = [
  {
    id: 'KNOW-01',
    judul: 'SOP Pelaksanaan Audit Teknik Internal dan Penyusunan LHP Berstandar SPI',
    nomorDokumen: 'SOP-SPI-TEK-01/REV-2025',
    kategori: 'SOP',
    tahun: 2025,
    ringkasan: 'Tata cara komprehensif mulai dari penyusunan PKPT, penyusunan kertas kerja audit (KKA), validasi 4-unsur temuan (kondisi, kriteria, sebab, akibat), serta mekanisme perumusan rekomendasi bernilai tambah.',
    linkDownload: '#',
    totalDibaca: 142,
    kuisTersedia: true,
    kuisSoal: [
      {
        pertanyaan: 'Apakah 4 unsur pokok yang harus terpenuhi dalam penyusunan temuan audit teknik?',
        pilihan: [
          'Kondisi, Kriteria, Sebab, Akibat',
          'Biaya, Waktu, Mutu, Lingkungan',
          'Tinjauan, Bukti, Hipotesis, Kesimpulan',
          'Perencanaan, Pelaksanaan, Monitoring, Evaluasi'
        ],
        kunciJawaban: 0
      },
      {
        pertanyaan: 'Kapan Supervisor Pengawas Teknik harus memverifikasi bukti tindak lanjut dari auditee?',
        pilihan: [
          'Paling lambat 30 hari kalender sejak laporan akhir disahkan',
          'Maksimal 5 hari kerja sejak notifikasi bukti perbaikan diunggah ke sistem',
          'Hanya saat rapat koordinasi akhir tahun buku',
          'Ketika proyek sudah serah terima akhir (FHO)'
        ],
        kunciJawaban: 1
      }
    ]
  },
  {
    id: 'KNOW-02',
    judul: 'Pedoman Penilaian Kelaikan Hasil Pekerjaan Barang/Jasa oleh Panitia PPHP (Sesuai Huruf G)',
    nomorDokumen: 'PED-PPHP-PBJ-03/2024',
    kategori: 'Pedoman',
    tahun: 2024,
    ringkasan: 'Pedoman standar operasional tim pemeriksa fisik barang/jasa, pengujian toleransi dimensi, uji fungsi mekanikal elektrikal, dan penerbitan Berita Acara Pemeriksaan (BAPP) & Berita Acara Pembayaran (BAP).',
    linkDownload: '#',
    totalDibaca: 98,
    kuisTersedia: true,
    kuisSoal: [
      {
        pertanyaan: 'Jika hasil uji fisik menunjukkan deviasi minor yang tidak mempengaruhi fungsi utama sistem, langkah PPHP adalah:',
        pilihan: [
          'Langsung menolak paket pekerjaan secara permanen',
          'Menerbitkan BA Pemeriksaan Berstatus Layak dengan Catatan Perbaikan sebelum BAP diteken',
          'Mengabaikan deviasi dan langsung menerbitkan BAP 100%',
          'Meminta ganti rugi uang tunai di luar sistem'
        ],
        kunciJawaban: 1
      }
    ]
  },
  {
    id: 'KNOW-03',
    judul: 'Spesifikasi Umum Bina Marga 2020 (Revisi 2) untuk Pekerjaan Konstruksi Jalan dan Jembatan',
    nomorDokumen: 'SNI/BINA-MARGA-2020-R2',
    kategori: 'Standar SNI',
    tahun: 2020,
    ringkasan: 'Kumpulan standar teknis pengujian material timbunan, beton struktural, aspal hotmix, pile cap, baja tulangan, serta kriteria penerimaan toleransi lendutan jembatan.',
    linkDownload: '#',
    totalDibaca: 215,
    kuisTersedia: false
  },
  {
    id: 'KNOW-04',
    judul: 'Peraturan Presiden No. 12 Tahun 2021 tentang Pengadaan Barang dan Jasa Pemerintah',
    nomorDokumen: 'PERPRES-12-2021',
    kategori: 'Regulasi',
    tahun: 2021,
    ringkasan: 'Payung hukum ketentuan pengadaan barang/jasa, peran Pejabat Pembuat Komitmen (PPK), Pokja Pemilihan, Panitia Pemeriksa, dan sanksi keterlambatan serta blacklist vendor.',
    linkDownload: '#',
    totalDibaca: 180,
    kuisTersedia: false
  }
];

export const initialNotifikasi: NotifikasiAlert[] = [
  {
    id: 'NOTIF-01',
    judul: 'Tindak Lanjut Menunggu Verifikasi Anda',
    pesan: 'Unit Divisi Konstruksi telah mengunggah As-Built Drawing revisi untuk Temuan No. TMN/2026/02/002. Mohon diverifikasi.',
    tipe: 'info',
    waktu: '10 menit yang lalu',
    dibaca: false,
    linkTab: 'tindak-lanjut'
  },
  {
    id: 'NOTIF-02',
    judul: 'Peringatan Risiko Ekstrem (Kritis)',
    pesan: 'Retak Dinding Penahan Tanah STA 42+200 Sumedang berstatus Ekstrem (Skor 16). Mitigasi pemasangan shoring jatuh tempo dalam 2 hari!',
    tipe: 'critical',
    waktu: '1 jam yang lalu',
    dibaca: false,
    linkTab: 'risiko'
  },
  {
    id: 'NOTIF-03',
    judul: 'Jadwal Inspeksi Mutu QA Terbit',
    pesan: 'Inspeksi QA-INSP/2026/03/014 Pemipaan Turbin Unit 2 telah mencapai tahap hydrotest 18 bar.',
    tipe: 'warning',
    waktu: '3 jam yang lalu',
    dibaca: true,
    linkTab: 'qa'
  },
  {
    id: 'NOTIF-04',
    judul: 'Surat Tugas PPHP Baru Diterbitkan',
    pesan: 'Surat Tugas ST-PPHP/2026/03/095 untuk proyek Cikarang telah ditandatangani Supervisor Pengawas Teknik.',
    tipe: 'success',
    waktu: 'Kemarin',
    dibaca: true,
    linkTab: 'pphp'
  }
];
