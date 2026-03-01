export interface SkillCategory {
  category: string
  items: string[]
}

export const languages: string[] = [
  'JavaScript',
  'R',
  'C++',
  'HTML',
  'LaTeX',
  'Scratch',
  'Python',
]

export const software: string[] = [
  'RStudio',
  'RPubs',
  'Shiny Apps',
  'MiKTeX Console',
  'Overleaf',
  'Google Suite Apps',
  'Microsoft Office 365 Apps',
  'StatCrunch',
  'VCarve',
  'Ultimaker Cura',
  'Fusion 360',
  'Google Sketchup',
  'Geogebra',
  "Geometer's Sketchpad",
  'Various video editing platforms',
  'Zoom',
  'Pronto',
  'Discord',
  'Flipgrid',
]

export const systems: string[] = [
  'Blackboard',
  'Canvas',
  'Aeries',
  'MyStatLab',
  'Cengage WebAssign',
  'HTML Embedding',
  'CS360',
  'PeopleSoft',
]

export const hardware: string[] = [
  '3D Printers',
  'Metal/Wood/Laser CNC Machines',
  'Raspberry Pis (Single Board Computers)',
  'ESP8266/ESP32 and other various microcontrollers',
]

/** Shiny Apps URL referenced in the CV */
export const shinyAppsUrl = 'https://shuff4.shinyapps.io/CAASPPdata/'

export const skills = { languages, software, systems, hardware }
