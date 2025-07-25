import React, { useEffect, useState, useRef } from "react"
import { Button } from "./ui/button"
import { Menu, Github, Linkedin, FileText, X } from "lucide-react"
import { cn } from "../lib/utils"

export function NavHeader() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [letterHovered, setLetterHovered] = useState(-1)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)

  const portfolioText = "Karthik"

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024
  const isDesktop = windowWidth >= 1024
  const isLargeTablet = windowWidth >= 768 && windowWidth < 1024

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }
    
    updateWindowWidth()
    
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateWindowWidth, 100)
    }
    
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }
    
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.1))
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          if (isMobile) {
            setIsNavbarVisible(currentScrollY < lastScrollY || currentScrollY < 50)
          } else {
            setIsNavbarVisible(true)
          }
          
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile])

  useEffect(() => {
    if (isDesktop && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isDesktop, mobileMenuOpen])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const getDynamicPadding = () => {
    if (isMobile) {
      return {
        paddingTop: "8px",
        paddingLeft: "12px",
        paddingRight: "12px"
      }
    } else if (isTablet) {
      return {
        paddingTop: `${12 + scrollProgress * 6}px`,
        paddingLeft: `${16 + scrollProgress * 8}px`,
        paddingRight: `${16 + scrollProgress * 8}px`
      }
    } else {
      return {
        paddingTop: `${8 + scrollProgress * 8}px`,
        paddingLeft: `${scrollProgress * 16}px`,
        paddingRight: `${scrollProgress * 16}px`
      }
    }
  }

  const getNavbarStyles = () => {
    if (isMobile) {
      return {}
    } else if (isTablet) {
      return {
        width: scrollProgress === 0 ? "100%" : `${100 - scrollProgress * 15}%`,
        backgroundColor: `rgba(0, 0, 0, ${0.3 + scrollProgress * 0.3})`,
        backdropFilter: `blur(${12 + scrollProgress * 8}px)`,
        borderColor: `rgba(255, 255, 255, ${0.05 + scrollProgress * 0.05})`
      }
    } else {
      return {
        width: scrollProgress === 0 ? "100%" : `${100 - scrollProgress * 25}%`,
        backgroundColor: `rgba(0, 0, 0, ${scrollProgress * 0.4})`,
        backdropFilter: `blur(${scrollProgress * 16}px)`,
        borderColor: `rgba(255, 255, 255, ${scrollProgress * 0.1})`
      }
    }
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 w-full z-50 flex justify-center transition-all duration-300",
      isMobile ? "pt-2" : "pt-0"
    )}>
      <div
        className="w-full px-4 flex justify-center"
        style={getDynamicPadding()}
      >
        <nav
          className={cn(
            "relative w-full rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-300 ease-in-out",
            { 
              "opacity-0 translate-y-[-100%]": !isNavbarVisible && isMobile,
              "opacity-100 translate-y-0": isNavbarVisible || !isMobile
            }
          )}
          style={getNavbarStyles()}
        >
          <div className={cn(
            "flex items-center justify-between",
            isMobile ? "h-14 px-4" : isTablet ? "h-16 px-5" : "h-16 px-6"
          )}>
            <div
              className="text-white hover:text-white/80 transition-colors flex items-center gap-2 shrink-0 relative cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false)
                setLetterHovered(-1)
              }}
              onClick={() => scrollToSection('hero')}
            >
              <div className="relative">
                <div className="flex items-center">
                  {portfolioText.split('').map((letter, index) => (
                    <span
                      key={index}
                      className={cn(
                        "font-semibold transition-all duration-300 hover:scale-125 cursor-default",
                        isMobile ? "text-lg" : isTablet ? "text-xl" : "text-xl",
                        letterHovered === index ? "text-primary animate-bounce" : "",
                        isHovered ? "hover:text-primary" : "",
                        isHovered && letterHovered === -1 ? "animate-pulse" : ""
                      )}
                      style={{
                        opacity: isMobile ? 1 : Math.max(0, 1 - scrollProgress * 2),
                        textShadow: letterHovered === index ? "0 0 20px rgba(255, 255, 0, 0.5)" : "none",
                        transform: `translateY(${letterHovered === index ? "-2px" : "0"})`,
                      }}
                      onMouseEnter={() => setLetterHovered(index)}
                      onMouseLeave={() => setLetterHovered(-1)}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                {isHovered && !isMobile && (
                  <div 
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"
                    style={{
                      opacity: Math.max(0, 1 - scrollProgress * 2)
                    }}
                  />
                )}
              </div>
            </div>

            {isDesktop && (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                  <button onClick={() => scrollToSection('about')} className="text-[#989898] hover:text-white transition-colors text-sm font-medium">
                    About
                  </button>
                  <button onClick={() => scrollToSection('education')} className="text-[#989898] hover:text-white transition-colors text-sm font-medium">
                    Education
                  </button>
                  <button onClick={() => scrollToSection('techstack')} className="text-[#989898] hover:text-white transition-colors text-sm font-medium">
                    Tech Stack
                  </button>
                  <button onClick={() => scrollToSection('projects')} className="text-[#989898] hover:text-white transition-colors text-sm font-medium">
                    Projects
                  </button>
                  <button onClick={() => scrollToSection('achievements')} className="text-[#989898] hover:text-white transition-colors text-sm font-medium">
                    Achievements
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="text-[#989898] hover:text-white transition-colors text-sm font-medium">
                    Contact
                  </button>
                </div>
              </div>
            )}

            {isLargeTablet && !isDesktop && (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-6">
                  <button onClick={() => scrollToSection('about')} className="text-[#989898] hover:text-white transition-colors text-xs font-medium">
                    About
                  </button>
                  <button onClick={() => scrollToSection('education')} className="text-[#989898] hover:text-white transition-colors text-xs font-medium">
                    Education
                  </button>
                  <button onClick={() => scrollToSection('projects')} className="text-[#989898] hover:text-white transition-colors text-xs font-medium">
                    Projects
                  </button>
                  <button onClick={() => scrollToSection('achievements')} className="text-[#989898] hover:text-white transition-colors text-xs font-medium">
                    Achievements
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="text-[#989898] hover:text-white transition-colors text-xs font-medium">
                    Contact
                  </button>
                </div>
              </div>
            )}

            {isDesktop && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <a 
                    href="https://leetcode.com/u/karthik_ram_p/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 transition-all duration-300"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#FFA116] via-[#B3B3B3] to-[#FFA116] rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur" />
                    <div className="relative flex items-center text-[#989898] group-hover:text-[#FFA116] transition-colors">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-5 h-5 transition-transform group-hover:scale-110"
                      >
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                      </svg>
                    </div>
                  </a>

                  <a 
                    href="https://github.com/karthikram-p" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 transition-all duration-300"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#6e5494] via-[#B3B3B3] to-[#6e5494] rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur" />
                    <div className="relative flex items-center text-[#989898] group-hover:text-white transition-colors">
                      <Github className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                  </a>

                  <a 
                    href="https://www.linkedin.com/in/peta-karthik-ram-443040259/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-2 transition-all duration-300"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#0A66C2] via-[#B3B3B3] to-[#0A66C2] rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur" />
                    <div className="relative flex items-center text-[#989898] group-hover:text-[#0A66C2] transition-colors">
                      <Linkedin className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                  </a>
                </div>

                <div className="w-px h-6 bg-white/10 mx-2" />

                <a
                  href="https://drive.google.com/file/d/1P9CH4alWsDv_B_4iAQH_tKolef5e6Vco/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    className="bg-white text-black hover:bg-white hover:text-black transition-all relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-white to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy" />
                    <FileText className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">Resume</span>
                  </Button>
                </a>
              </div>
            )}

            {isLargeTablet && !isDesktop && (
              <div className="flex items-center gap-2">
                <a
                  href="https://drive.google.com/file/d/1P9CH4alWsDv_B_4iAQH_tKolef5e6Vco/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-white hover:text-black transition-all relative group overflow-hidden"
                  >
                    <FileText className="w-4 h-4 mr-1 relative z-10" />
                    <span className="relative z-10 text-xs">Resume</span>
                  </Button>
                </a>
                <button
                  ref={menuButtonRef}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={cn(
                    "p-2 hover:bg-white/5 rounded-lg transition-colors",
                    mobileMenuOpen && "bg-white/5"
                  )}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            )}

            {(isMobile || (isTablet && !isLargeTablet)) && (
              <button
                ref={menuButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "p-2 hover:bg-white/5 rounded-lg transition-colors",
                  mobileMenuOpen && "bg-white/5"
                )}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>

          {mobileMenuOpen && !isDesktop && (
            <div
              ref={mobileMenuRef}
              className={cn(
                "absolute left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-xl shadow-lg",
                isTablet ? "top-16 rounded-b-2xl" : "top-14 rounded-b-2xl"
              )}
            >
              <div className={cn(
                "px-6 py-6 space-y-6",
                isTablet && "py-8"
              )}>
                <div className="space-y-4">
                  <button
                    onClick={() => scrollToSection('about')}
                    className={cn(
                      "block text-[#989898] hover:text-white transition-colors font-medium w-full text-left",
                      isTablet ? "text-base" : "text-sm"
                    )}
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection('education')}
                    className={cn(
                      "block text-[#989898] hover:text-white transition-colors font-medium w-full text-left",
                      isTablet ? "text-base" : "text-sm"
                    )}
                  >
                    Education
                  </button>
                  <button
                    onClick={() => scrollToSection('techstack')}
                    className={cn(
                      "block text-[#989898] hover:text-white transition-colors font-medium w-full text-left",
                      isTablet ? "text-base" : "text-sm"
                    )}
                  >
                    Tech Stack
                  </button>
                  <button
                    onClick={() => scrollToSection('projects')}
                    className={cn(
                      "block text-[#989898] hover:text-white transition-colors font-medium w-full text-left",
                      isTablet ? "text-base" : "text-sm"
                    )}
                  >
                    Projects
                  </button>
                  <button
                    onClick={() => scrollToSection('achievements')}
                    className={cn(
                      "block text-[#989898] hover:text-white transition-colors font-medium w-full text-left",
                      isTablet ? "text-base" : "text-sm"
                    )}
                  >
                    Achievements
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className={cn(
                      "block text-[#989898] hover:text-white transition-colors font-medium w-full text-left",
                      isTablet ? "text-base" : "text-sm"
                    )}
                  >
                    Contact
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-6">
                  <div className={cn(
                    "flex items-center gap-6",
                    isTablet ? "justify-center" : "justify-start"
                  )}>
                    <a 
                      href="https://leetcode.com/u/karthik_ram_p/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#FFA116] via-[#B3B3B3] to-[#FFA116] rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur" />
                      <div className="relative flex items-center text-[#989898] group-hover:text-[#FFA116] transition-colors">
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className={cn(
                            "transition-transform group-hover:scale-110",
                            isTablet ? "w-6 h-6" : "w-5 h-5"
                          )}
                        >
                          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                        </svg>
                      </div>
                    </a>
                    <a 
                      href="https://github.com/karthikram-p" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#6e5494] via-[#B3B3B3] to-[#6e5494] rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur" />
                      <div className="relative flex items-center text-[#989898] group-hover:text-white transition-colors">
                        <Github className={cn(
                          "transition-transform group-hover:scale-110",
                          isTablet ? "w-6 h-6" : "w-5 h-5"
                        )} />
                      </div>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/peta-karthik-ram-443040259/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#0A66C2] via-[#B3B3B3] to-[#0A66C2] rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur" />
                      <div className="relative flex items-center text-[#989898] group-hover:text-[#0A66C2] transition-colors">
                        <Linkedin className={cn(
                          "transition-transform group-hover:scale-110",
                          isTablet ? "w-6 h-6" : "w-5 h-5"
                        )} />
                      </div>
                    </a>
                  </div>

                  <a
                    href="https://drive.google.com/file/d/1P9CH4alWsDv_B_4iAQH_tKolef5e6Vco/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      className={cn(
                        "w-full bg-white text-black hover:bg-white hover:text-black transition-all relative group overflow-hidden",
                        isTablet ? "h-12 text-base" : "h-10"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-white to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy" />
                      <FileText className={cn(
                        "mr-2 relative z-10",
                        isTablet ? "w-5 h-5" : "w-4 h-4"
                      )} />
                      <span className="relative z-10">Resume</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}