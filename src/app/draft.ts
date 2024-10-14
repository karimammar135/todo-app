// Sidebar variant
const sidebarVariant = {
    hidden: {
        x: "-100%"
    },
    visible: {
        x: 0,
        transition: {
            delay: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.2
        }
    }
}
// Option variant
const optionVariant = {
    hidden: {
        x: -10,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
    }
}