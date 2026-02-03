import React from 'react';
import BabaJaigurudevComponent from '../components/BabaJaigurudev';

import { Helmet } from 'react-helmet-async';

function BabaJaigurudev() {
    return (
        <>
            <Helmet>
                <title>Baba Jaigurudev Ji Maharaj - Life & Teachings | Human to Soul</title>
                <meta name="description" content="Read the biography and divine teachings of Param Sant Baba Jaigurudev Ji Maharaj. The awakener of souls and preacher of vegetarianism and human unity." />
                <meta name="keywords" content="Master of Time, Owner of Time, Baba Jaigurudev, Jai Gurudev, Mathura Ashram, Tulsidas Ji Maharaj, Santmat, Vegetarianism, Spiritual Master" />
            </Helmet>
            <BabaJaigurudevComponent />
        </>
    );
}

export default BabaJaigurudev;