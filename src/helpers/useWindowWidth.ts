import React, {useEffect, useState} from 'react'
import { debounce } from '@/components/ui/debounce';


export function useWindowWidth():number {
    const [windowWidth, setWindowWidth] = useState(0)

    // Keep track of window's width
    useEffect(() => {
        const handleResize = debounce(():void => {
            setWindowWidth(window.innerWidth)
        }, 500)
        setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => {
        window.removeEventListener("resize", handleResize)
        }
    }, [])

    return windowWidth
}
