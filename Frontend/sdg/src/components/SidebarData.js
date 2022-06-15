import React from 'react'
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: 'Agenda 2030', 
        path: '/agenda',
        icon: <IoIcons.IoMdGlobe/>,
        cName: 'nav-text'
    },
    {
        title: 'Obiettivi', 
        path: '/',
        icon: <IoIcons.IoMdRibbon/>,
        cName: 'nav-text'
    },
    {
        title: 'Ricerca', 
        path: '/search',
        icon: <AiIcons.AiOutlineSearch/>,
        cName: 'nav-text'
    },
    {
        title: 'Avanzamento', 
        path: '/avanzamento',
        icon: <IoIcons.IoMdAnalytics/>,
        cName: 'nav-text'
    },

]