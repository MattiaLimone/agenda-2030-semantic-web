import React from 'react'
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: 'Obiettivi', 
        path: '/',
        icon: <IoIcons.IoMdRibbon/>,
        cName: 'nav-text'
    },
    {
        title: 'Target', 
        path: '/target',
        icon: <IoIcons.IoMdRibbon/>,
        cName: 'nav-text'
    },
    {
        title: 'Indicatori', 
        path: '/allIndicators',
        icon: <IoIcons.IoMdRibbon/>,
        cName: 'nav-text'
    },
    {
        title: 'Ricerca', 
        path: '/search',
        icon: <AiIcons.AiOutlineSearch/>,
        cName: 'nav-text'
    }

]