
import { Chapter, Plan } from './types';

export const CONTACT_INFO = {
  phone: '7233893011',
  secondaryPhone: '7738483538',
  email: 'raiadarsh3848@gmail.com'
};

export const PLANS: Plan[] = [
  { id: '1', price: 99, duration: '1 Month Access' },
  { id: '2', price: 199, duration: '3 Months Access' },
  { id: '3', price: 399, duration: '6 Months Access' },
  { id: '4', price: 699, duration: '1 Year Access' }
];

export const CHAPTER_DATA: Record<string, Chapter[]> = {
  Biology: [
    // Class 11 Chapters (1 - 24 as per user image)
    { id: 'b11_1', name: '1. The Living World', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_2', name: '2. Biological Classification', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_3', name: '3. Plant Kingdom', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_4', name: '4. Animal Kingdom', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_5', name: '5. Morphology of Flowering Plants', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_6', name: '6. Anatomy of Flowering Plants', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_7', name: '7. Structural organisation in animals', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_8', name: '8. Cell - The unit of life', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_9', name: '9. Cell Cycle and Cell Division', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_10', name: '10. Biomolecules', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_11', name: '11. Enzymes', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_12', name: '12. Transport in plants', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_13', name: '13. Mineral Nutrition', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_14', name: '14. Photosynthesis in higher plants', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_15', name: '15. Respiration in plants', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_16', name: '16. Plant Growth and Development', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_17', name: '17. Digestion and Absorption', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_18', name: '18. Breathing and Exchange of gases', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_19', name: '19. Body fluid and Circulation', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_20', name: '20. Excretory products and their elimination', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_21', name: '21. Locomotion and Movement', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_22', name: '22. Neural Control and Coordination', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_23', name: '23. Sense Organ (Eye and Ear)', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b11_24', name: '24. Endocrine Glands', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },

    // Class 12 Chapters (25 - 38 as per user image)
    { id: 'b12_25', name: '25. Reproduction in Organisms', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_26', name: '26. Sexual reproduction in flowering plants', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_27', name: '27. Human reproduction & Reproductive health', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_28', name: '28. Principles of Inheritance and Variation', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_29', name: '29. Molecular Basis of Inheritance', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_30', name: '30. Evolution', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_31', name: '31. Human Health and Disease', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_32', name: '32. Animal Husbandry', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_33', name: '33. Strategies for Enhancement in food production', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_34', name: '34. Biotechnology - Principles and Processes', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_35', name: '35. Biotechnology and its Application', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_36', name: '36. Microbes in Human Welfare', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_37', name: '37. Organism and Population', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'b12_38', name: '38. Ecosystem', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 }
  ],
  Physics: [
    { id: 'p11_1', name: 'Units and Measurements', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p11_2', name: 'Motion in a Straight Line', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p11_3', name: 'Laws of Motion', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p11_4', name: 'Work, Energy and Power', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p11_5', name: 'Gravitation', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p12_1', name: 'Electrostatic Potential', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p12_2', name: 'Current Electricity', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'p12_3', name: 'Ray Optics', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 }
  ],
  Chemistry: [
    { id: 'c11_1', name: 'Basic Concepts of Chemistry', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'c11_2', name: 'Structure of Atom', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'c11_3', name: 'Chemical Bonding', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'c11_4', name: 'Thermodynamics', class: '11', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'c12_1', name: 'Solutions', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'c12_2', name: 'Electrochemistry', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 },
    { id: 'c12_3', name: 'Chemical Kinetics', class: '12', difficulty: 'NEET Level', questionCount: 50, timeLimit: 0 }
  ]
};
