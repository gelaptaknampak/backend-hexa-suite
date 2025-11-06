

CREATE TABLE public.absensi (
    id integer NOT NULL,
    idk integer,
    masuk time(6) with time zone,
    keluar time(6) with time zone,
    status character varying(20) NOT NULL,
    date date NOT NULL,
    pengajuanid integer
);


ALTER TABLE public.absensi OWNER TO postgres;


CREATE SEQUENCE public.absensi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.absensi_id_seq OWNER TO postgres;

ALTER SEQUENCE public.absensi_id_seq OWNED BY public.absensi.id;

CREATE TABLE public.announcement (
    id integer NOT NULL,
    admin_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    attachment character varying(10000000),
    tanggal_upload date
);


ALTER TABLE public.announcement OWNER TO postgres;

CREATE SEQUENCE public.announcement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcement_id_seq OWNER TO postgres;

ALTER SEQUENCE public.announcement_id_seq OWNED BY public.announcement.id;




CREATE TABLE public.asset (
    id integer NOT NULL,
    nama_barang character varying(255),
    merek character varying(255),
    model_tipe character varying(255),
    harga integer,
    jumlah integer
);


ALTER TABLE public.asset OWNER TO postgres;



CREATE SEQUENCE public.asset_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asset_id_seq OWNER TO postgres;



ALTER SEQUENCE public.asset_id_seq OWNED BY public.asset.id;




CREATE TABLE public.audit (
    detail character varying(255),
    date date,
    id integer NOT NULL
);


ALTER TABLE public.audit OWNER TO postgres;


CREATE SEQUENCE public.audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_id_seq OWNER TO postgres;


ALTER SEQUENCE public.audit_id_seq OWNED BY public.audit.id;



CREATE TABLE public.biodata (
    id integer NOT NULL,
    logo character varying(10000000),
    company_name character varying(255) NOT NULL,
    company_pnumber character varying(20),
    email character varying(255),
    address character varying(255),
    province character varying(50),
    city character varying(50),
    industry character varying(50),
    company_size integer,
    npwp_lama bigint,
    npwp_baru bigint,
    company_taxable_date date,
    tax_person_name character varying(255),
    taxperson_npwp bigint,
    taxperson_npwp_16_digit bigint,
    hq_initial character varying(50),
    hq_code character varying(255),
    show_branch_name boolean,
    umr bigint,
    umr_province character varying(50),
    umr_city character varying(50),
    bpjs_ketenagakerjaan character varying(50),
    jkk double precision
);


ALTER TABLE public.biodata OWNER TO postgres;



CREATE SEQUENCE public.biodata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.biodata_id_seq OWNER TO postgres;


ALTER SEQUENCE public.biodata_id_seq OWNED BY public.biodata.id;


CREATE TABLE public.cuti (
    id integer NOT NULL,
    idk integer,
    status_pengganti boolean,
    status_head boolean,
    status_hr boolean,
    idpengganti integer,
    progress character varying(50)
);


ALTER TABLE public.cuti OWNER TO postgres;


CREATE SEQUENCE public.cuti_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuti_id_seq OWNER TO postgres;



ALTER SEQUENCE public.cuti_id_seq OWNED BY public.cuti.id;




CREATE TABLE public.filedata (
    id integer NOT NULL,
    uploader_id integer NOT NULL,
    karyawan_file character varying(10000000) NOT NULL,
    nama_file character varying(50),
    tanggal_publish date,
    tanggal_upload timestamp without time zone,
    access_list jsonb,
    tipe boolean DEFAULT false
);


ALTER TABLE public.filedata OWNER TO postgres;



CREATE SEQUENCE public.filedata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.filedata_id_seq OWNER TO postgres;



ALTER SEQUENCE public.filedata_id_seq OWNED BY public.filedata.id;




CREATE TABLE public.filelist (
    id integer NOT NULL,
    uploader_id integer NOT NULL,
    karyawan_file character varying(10000000) NOT NULL,
    nama_file character varying(50),
    tanggal_publish date,
    tanggal_upload timestamp without time zone,
    access_list integer[],
    tipe boolean DEFAULT false
);


ALTER TABLE public.filelist OWNER TO postgres;



CREATE SEQUENCE public.filelist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.filelist_id_seq OWNER TO postgres;



ALTER SEQUENCE public.filelist_id_seq OWNED BY public.filelist.id;




CREATE TABLE public.formula (
    id integer NOT NULL,
    tunjangan_kehadiran integer,
    tunjangan_transport integer,
    tunjangan_kerajinan integer,
    rumus_nama character varying(255),
    rumus_alpha character varying(255),
    rumus_izin character varying(255),
    rumus_telat character varying(255),
    rumus_sakit character varying(255),
    rumus_laporan character varying(255)
);


ALTER TABLE public.formula OWNER TO postgres;



CREATE SEQUENCE public.formula_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.formula_id_seq OWNER TO postgres;



ALTER SEQUENCE public.formula_id_seq OWNED BY public.formula.id;




CREATE TABLE public.karyawan (
    id integer NOT NULL,
    nama character varying(255),
    email character varying(255),
    password character varying(255),
    notelp character varying(20),
    alamat character varying(255),
    jabatan character varying(255),
    status character varying(50),
    nik character varying(255),
    npwp character varying(255),
    nikid character varying(255),
    dokumen character varying(10000000),
    divisi character varying(50),
    username character varying(20),
    cutimandiri integer,
    cutibersama integer,
    operation text[],
    role character varying(10),
    maritalstatus character varying(50),
    bankacc character varying(20),
    bankname character varying(20),
    religion character varying(20),
    tglmasuk date,
    tglkeluar date,
    dob date,
    level character varying(20),
    lokasikerja character varying(50),
    gender character varying(20),
    gaji integer,
    jawaban character varying(255)
);


ALTER TABLE public.karyawan OWNER TO postgres;


CREATE SEQUENCE public.karyawan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.karyawan_id_seq OWNER TO postgres;



ALTER SEQUENCE public.karyawan_id_seq OWNED BY public.karyawan.id;




CREATE TABLE public.laporan (
    id integer DEFAULT nextval('public.absensi_id_seq'::regclass) NOT NULL,
    idk integer NOT NULL,
    date date,
    keterangan character varying(255),
    dokumen character varying(10000000)[],
    lokasi character varying(255),
    jenis character varying(50),
    jam time(6) with time zone,
    targetdate date,
    ontime boolean,
    jamtarget character varying(10)
);


ALTER TABLE public.laporan OWNER TO postgres;



CREATE TABLE public.operation (
    id integer DEFAULT nextval('public.absensi_id_seq'::regclass) NOT NULL,
    operation character varying(20),
    fungsi character varying(255)
);


ALTER TABLE public.operation OWNER TO postgres;



CREATE TABLE public.overtime (
    id integer NOT NULL,
    note text,
    karyawan_id integer NOT NULL,
    mulai time without time zone NOT NULL,
    selesai time without time zone NOT NULL,
    tanggal_request date NOT NULL,
    tipe boolean NOT NULL,
    tanggal_overtime date,
    break time without time zone,
    photo integer,
    status boolean
);


ALTER TABLE public.overtime OWNER TO postgres;



CREATE SEQUENCE public.overtime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.overtime_id_seq OWNER TO postgres;



ALTER SEQUENCE public.overtime_id_seq OWNED BY public.overtime.id;



CREATE TABLE public.payroll (
    id integer NOT NULL,
    idk integer,
    potong double precision,
    nominal numeric,
    month integer,
    year integer,
    rumus json,
    detail json,
    value json,
    input json,
    isbonus boolean
);


ALTER TABLE public.payroll OWNER TO postgres;



CREATE SEQUENCE public.payroll_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payroll_id_seq OWNER TO postgres;



ALTER SEQUENCE public.payroll_id_seq OWNED BY public.payroll.id;



CREATE TABLE public.pengajuan (
    id integer NOT NULL,
    status boolean,
    tipe character varying(20),
    idk integer,
    date date NOT NULL,
    mulai date,
    selesai date,
    alasan character varying(255),
    jenis character varying(50),
    dokumen character varying(10000000),
    detailpengganti integer,
    suratsakit boolean
);


ALTER TABLE public.pengajuan OWNER TO postgres;



CREATE SEQUENCE public.pengajuan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pengajuan_id_seq OWNER TO postgres;



ALTER SEQUENCE public.pengajuan_id_seq OWNED BY public.pengajuan.id;




CREATE TABLE public.reimburst (
    id integer NOT NULL,
    idk integer,
    pembayaran character varying(255),
    keterangan character varying(255),
    date date,
    biaya character varying(255),
    transaksi date,
    status boolean,
    dokumen character varying(10000000),
    selesai boolean,
    progres character varying(20)
);


ALTER TABLE public.reimburst OWNER TO postgres;



CREATE SEQUENCE public.reimburst_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reimburst_id_seq OWNER TO postgres;



ALTER SEQUENCE public.reimburst_id_seq OWNED BY public.reimburst.id;



CREATE TABLE public.resign (
    id integer NOT NULL,
    idk integer,
    alasan character varying(255),
    date date,
    status boolean,
    tanggal_keluar date
);


ALTER TABLE public.resign OWNER TO postgres;



CREATE SEQUENCE public.resign_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resign_id_seq OWNER TO postgres;



ALTER SEQUENCE public.resign_id_seq OWNED BY public.resign.id;



CREATE TABLE public.schedule_cal (
    id integer NOT NULL,
    tipe boolean NOT NULL,
    tanggal_mulai date NOT NULL,
    tanggal_selesai date NOT NULL,
    judul character varying(100) NOT NULL,
    deskripsi text,
    mulai time without time zone,
    selesai time without time zone
);


ALTER TABLE public.schedule_cal OWNER TO postgres;


CREATE SEQUENCE public.schedule_cal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_cal_id_seq OWNER TO postgres;



ALTER SEQUENCE public.schedule_cal_id_seq OWNED BY public.schedule_cal.id;




CREATE TABLE public.scheduler (
    id integer NOT NULL,
    karyawan_id integer,
    schedule_id integer
);


ALTER TABLE public.scheduler OWNER TO postgres;



CREATE SEQUENCE public.scheduler_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scheduler_id_seq OWNER TO postgres;



ALTER SEQUENCE public.scheduler_id_seq OWNED BY public.scheduler.id;




ALTER TABLE ONLY public.absensi ALTER COLUMN id SET DEFAULT nextval('public.absensi_id_seq'::regclass);




ALTER TABLE ONLY public.announcement ALTER COLUMN id SET DEFAULT nextval('public.announcement_id_seq'::regclass);



ALTER TABLE ONLY public.asset ALTER COLUMN id SET DEFAULT nextval('public.asset_id_seq'::regclass);




ALTER TABLE ONLY public.audit ALTER COLUMN id SET DEFAULT nextval('public.audit_id_seq'::regclass);


ALTER TABLE ONLY public.biodata ALTER COLUMN id SET DEFAULT nextval('public.biodata_id_seq'::regclass);




ALTER TABLE ONLY public.cuti ALTER COLUMN id SET DEFAULT nextval('public.cuti_id_seq'::regclass);




ALTER TABLE ONLY public.filedata ALTER COLUMN id SET DEFAULT nextval('public.filedata_id_seq'::regclass);




ALTER TABLE ONLY public.filelist ALTER COLUMN id SET DEFAULT nextval('public.filelist_id_seq'::regclass);




ALTER TABLE ONLY public.formula ALTER COLUMN id SET DEFAULT nextval('public.formula_id_seq'::regclass);




ALTER TABLE ONLY public.karyawan ALTER COLUMN id SET DEFAULT nextval('public.karyawan_id_seq'::regclass);




ALTER TABLE ONLY public.overtime ALTER COLUMN id SET DEFAULT nextval('public.overtime_id_seq'::regclass);



ALTER TABLE ONLY public.payroll ALTER COLUMN id SET DEFAULT nextval('public.payroll_id_seq'::regclass);




ALTER TABLE ONLY public.pengajuan ALTER COLUMN id SET DEFAULT nextval('public.pengajuan_id_seq'::regclass);




ALTER TABLE ONLY public.reimburst ALTER COLUMN id SET DEFAULT nextval('public.reimburst_id_seq'::regclass);




ALTER TABLE ONLY public.resign ALTER COLUMN id SET DEFAULT nextval('public.resign_id_seq'::regclass);



ALTER TABLE ONLY public.schedule_cal ALTER COLUMN id SET DEFAULT nextval('public.schedule_cal_id_seq'::regclass);


ALTER TABLE ONLY public.scheduler ALTER COLUMN id SET DEFAULT nextval('public.scheduler_id_seq'::regclass);



ALTER TABLE ONLY public.audit
    ADD CONSTRAINT "Audit_pkey" PRIMARY KEY (id);




ALTER TABLE ONLY public.absensi
    ADD CONSTRAINT absensi_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT announcement_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.asset
    ADD CONSTRAINT asset_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.biodata
    ADD CONSTRAINT biodata_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.cuti
    ADD CONSTRAINT cuti_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.filedata
    ADD CONSTRAINT filedata_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.filelist
    ADD CONSTRAINT filelist_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.formula
    ADD CONSTRAINT formula_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.karyawan
    ADD CONSTRAINT karyawan_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.laporan
    ADD CONSTRAINT laporan_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.operation
    ADD CONSTRAINT operation_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.overtime
    ADD CONSTRAINT overtime_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.pengajuan
    ADD CONSTRAINT pengajuan_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.reimburst
    ADD CONSTRAINT reimburst_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.resign
    ADD CONSTRAINT resign_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.schedule_cal
    ADD CONSTRAINT schedule_cal_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.scheduler
    ADD CONSTRAINT scheduler_pkey PRIMARY KEY (id);




ALTER TABLE ONLY public.absensi
    ADD CONSTRAINT unique_idk_date UNIQUE (idk, date);




CREATE INDEX fki_dp_fk ON public.pengajuan USING btree (detailpengganti);




CREATE INDEX fki_idk_fk ON public.absensi USING btree (idk);




ALTER TABLE ONLY public.pengajuan
    ADD CONSTRAINT dp_fk FOREIGN KEY (detailpengganti) REFERENCES public.cuti(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;




ALTER TABLE ONLY public.filedata
    ADD CONSTRAINT filedata_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.karyawan(id);




ALTER TABLE ONLY public.filelist
    ADD CONSTRAINT filelist_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.karyawan(id);



ALTER TABLE ONLY public.overtime
    ADD CONSTRAINT fk_author FOREIGN KEY (karyawan_id) REFERENCES public.karyawan(id);



ALTER TABLE ONLY public.announcement
    ADD CONSTRAINT fk_author FOREIGN KEY (admin_id) REFERENCES public.karyawan(id);



ALTER TABLE ONLY public.scheduler
    ADD CONSTRAINT fk_author FOREIGN KEY (karyawan_id) REFERENCES public.karyawan(id);



ALTER TABLE ONLY public.scheduler
    ADD CONSTRAINT fk_schedule FOREIGN KEY (schedule_id) REFERENCES public.schedule_cal(id);



ALTER TABLE ONLY public.absensi
    ADD CONSTRAINT idk_fk FOREIGN KEY (idk) REFERENCES public.karyawan(id) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public.pengajuan
    ADD CONSTRAINT idk_fk FOREIGN KEY (idk) REFERENCES public.karyawan(id) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public.reimburst
    ADD CONSTRAINT idk_fk FOREIGN KEY (idk) REFERENCES public.karyawan(id) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT idk_fk FOREIGN KEY (idk) REFERENCES public.karyawan(id) ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE ONLY public.laporan
    ADD CONSTRAINT idk_fk FOREIGN KEY (idk) REFERENCES public.karyawan(id) ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY public.resign
    ADD CONSTRAINT idk_fk FOREIGN KEY (idk) REFERENCES public.karyawan(id) ON UPDATE CASCADE ON DELETE CASCADE;

