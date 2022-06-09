import React from 'react'
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: 'Home', 
        path: '/',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Agenda 2030', 
        path: '/agenda',
        icon: <IoIcons.IoMdGlobe/>,
        cName: 'nav-text'
    },
    {
        title: 'Obiettivi', 
        path: '/obiettivi',
        icon: <IoIcons.IoMdRibbon/>,
        cName: 'nav-text'
    },
    {
        title: 'Target', 
        path: '/target',
        icon: <IoIcons.IoIosFlag/>,
        cName: 'nav-text'
    },
    {
        title: 'Indicatori', 
        path: '/indicatori',
        icon: <AiIcons.AiFillControl/>,
        cName: 'nav-text'
    },
    {
        title: 'Avanzamento', 
        path: '/avanzamento',
        icon: <IoIcons.IoMdAnalytics/>,
        cName: 'nav-text'
    },

]