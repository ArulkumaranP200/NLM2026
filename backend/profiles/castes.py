# Reference list of commonly-recognized caste/community groups per religion, used to
# populate the caste dropdown during registration and profile editing. This is not
# exhaustive or authoritative — caste/community classification varies significantly
# by region, and this list only covers widely-recognized groups plus an "Other" catch-all
# so users whose community isn't listed can still register accurately.
CASTES_BY_RELIGION = {
    'hindu': [
        'Adi Dravidar', 'Agarwal', 'Agamudayar', 'Ahir', 'Arunthathiyar', 'Bania',
        'Brahmin (Iyer)', 'Brahmin (Iyengar)', 'Brahmin (Other)', 'Chettiar',
        'Devendra Kula Vellalar', 'Gounder (Kongu Vellalar)', 'Gujjar', 'Jat',
        'Kallar', 'Kamma', 'Kammavar Naidu', 'Kayastha', 'Kshatriya', 'Kunbi',
        'Kurmi', 'Lingayat', 'Maratha', 'Maravar', 'Mudaliar', 'Nadar', 'Naidu',
        'Nair', 'Pallar', 'Patel / Patidar', 'Pillai / Vellalar', 'Rajput',
        'Reddy', 'Saurashtra', 'Thevar', 'Vanniyar', 'Vokkaliga', 'Yadav (Konar)',
        'Other', 'No / Prefer not to say',
    ],
    'muslim': [
        'Sunni', 'Shia', 'Syed', 'Sheikh', 'Pathan (Khan)', 'Mughal', 'Ansari',
        'Qureshi', 'Rajput Muslim', 'Memon', 'Bohra', 'Khoja', 'Labbay',
        'Rowther', 'Marakkayar', 'Other', 'No / Prefer not to say',
    ],
    'christian': [
        'Roman Catholic', 'Latin Catholic', 'Syrian Christian', 'Knanaya',
        'Church of South India (CSI)', 'Church of North India (CNI)', 'Orthodox',
        'Baptist', 'Pentecostal', 'Protestant', 'Other', 'No / Prefer not to say',
    ],
    'sikh': [
        'Jat Sikh', 'Khatri Sikh', 'Arora Sikh', 'Ramgarhia', 'Saini',
        'Ravidasia', 'Mazhabi Sikh', 'Other', 'No / Prefer not to say',
    ],
    'jain': [
        'Digambar', 'Shwetambar', 'Agarwal Jain', 'Oswal', 'Porwal',
        'Khandelwal', 'Other', 'No / Prefer not to say',
    ],
    'buddhist': [
        'Navayana (Ambedkarite)', 'Theravada', 'Mahayana', 'Newar Buddhist',
        'Other', 'No / Prefer not to say',
    ],
    'other': ['Other', 'No / Prefer not to say'],
}


def castes_for_religion(religion):
    return CASTES_BY_RELIGION.get((religion or '').strip().lower())


def all_castes():
    seen = []
    for castes in CASTES_BY_RELIGION.values():
        for caste in castes:
            if caste not in seen:
                seen.append(caste)
    return sorted(seen)
