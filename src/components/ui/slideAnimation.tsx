import { motion, AnimatePresence, useAnimationControls } from "framer-motion";  
import { ReactNode, FC } from "react";  
   
  
// TYPES  
interface ILayoutProps {  
  children: ReactNode;  
}  
  
export const SlideAnimation: FC<ILayoutProps> = ({ children }) => {  
  return (  
    <AnimatePresence mode={'wait'}>  
      <motion.div  
        initial="initialState"  
        animate="animateState"  
        exit="exitState"  
        transition={{  
          type: "tween",  
          duration: 2 
        }}  
        variants={{  
          initialState: {  
            x: "-100%"   
          },  
          animateState: {  
            x: 0
          },  
          exitState: {  
            x: "100%"  
          }  
        }}  
        className="min-h-screen w-full" // Feel free to add your classes here  
      >  
        {children}  
      </motion.div>  
    </AnimatePresence>  
  );  
}