import React from 'react';
import BabaUmakantComponent from '../components/BabaUmakant';

import { Helmet } from 'react-helmet-async';

function BabaUmakant() {
    return (
        <>
            <Helmet>
                <title>Baba Umakant Ji Maharaj - Current Spiritual Master | Human to Soul</title>
                <meta name="description" content="Learn about Param Sant Baba Umakant Ji Maharaj, the successor of Baba Jaigurudev. Discover his Satsang schedule, teachings, and Ujjain Ashram details." />
                <meta name="keywords" content="Baba Umakant Ji Maharaj, Ujjain Ashram, Satsang, Jai Gurudev Successor, Spiritual Guide, Naam Daan, Painhari" />
            </Helmet>
            <BabaUmakantComponent />
        </>
    );
}

export default BabaUmakant;