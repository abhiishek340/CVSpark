import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';

// Register fonts
try {
  Font.register({
    family: 'Carlito',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/carlito/v3/3Jn9SDPw3m-pk039PDA.ttf' },
      { src: 'https://fonts.gstatic.com/s/carlito/v3/3Jn4SDPw3m-pk039BIykaX0.ttf', fontWeight: 'bold' }
    ],
  });

  Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf' }, // regular
      { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf', fontWeight: 'bold' }, // bold
    ],
  });

  Font.register({
    family: 'Times New Roman',
    src: 'https://fonts.cdnfonts.com/s/56973/times new roman.woff',
  });

  Font.register({
    family: 'Arial',
    src: 'https://fonts.cdnfonts.com/s/29105/ARIAL.woff',
  });
} catch (err) {
  console.error('Failed to register fonts:', err);
}

interface MyDocumentProps {
  projectData: any[];
  skillsData: any[];
  experienceData: any[];
  educationData: any[];
  personalData: any[];
  font: string;
  fontSize: number;
  colors: { primary: string; secondary: string };
  margins: { top: number; right: number; bottom: number; left: number };
  isEditing?: boolean;
  onTextClick?: (type: string, index: number, field: string, value: string) => void;
}

const MyDocument: React.FC<MyDocumentProps> = ({
  projectData,
  skillsData,
  experienceData,
  educationData,
  personalData,
  font = "Carlito",
  fontSize = 10.5,
  colors = { primary: "#000000", secondary: "#666666" },
  margins = { top: 30, right: 30, bottom: 30, left: 30 },
  isEditing = false,
  onTextClick,
}) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
      fontFamily: font,
      fontSize: fontSize,
      color: colors.primary,
      minHeight: '100%',
      position: 'relative'
    },
    outerSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    innerSectionLeft: {
      fontSize: 10,
    },
    innerSectionRight: {
      fontSize: fontSize,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    textRight: {
      textAlign: 'right',
    },
    section: {
      marginBottom: 5,
      flexGrow: 1,
    },
    sectionHorizontal: {
      display: 'flex',
      flexDirection: 'row',
      fontSize: 10.5,
      gap: 4
    },
    header: {
      fontSize: 22,
      marginBottom: 2,
    },
    subHeaderContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    subHeader: {
      color: colors.secondary,
      fontSize: 14,
      marginBottom: 2,
      marginRight: 5,
      fontWeight: 'bold',
    },
    horizontalLine: {
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
      flexGrow: 1,
    },
    text: {
      fontSize: fontSize,
      marginBottom: 2,
      fontWeight: 'normal',
    },
    textHeader: {
      fontSize: fontSize + 1.5,
      fontWeight: 'bold',
    },
    topLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
      paddingRight: 0,
      fontWeight: 'bold',
      width: '100%',
    },
    skillContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 5,
    },
    skillLabel: {
      fontFamily: font,
      fontWeight: 'bold',
      fontSize: fontSize,
      marginRight: 5,
      width: '25%', // Adjust this value as needed
    },
    skillValue: {
      fontFamily: font,
      fontSize: fontSize,
      flexWrap: 'wrap',
      flex: 1,
      width: '75%', // Adjust this value as needed
    },
    textBold: {
      fontSize: fontSize,
      fontWeight: 'bold',
    },
    bullet: {
      fontSize: fontSize,
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize,
      marginLeft: 5,
    },
    link: {
      fontSize: fontSize,
      textDecoration: 'underline',
      color: 'black',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'black',
    },
    editableText: {
      backgroundColor: isEditing ? '#f8f9fa' : 'transparent',
      padding: isEditing ? 2 : 0,
      border: isEditing ? '1px dashed #dee2e6' : 'none',
    },
  });

  // Add renderBulletPoints function
  const renderBulletPoints = (text: string) => {
    if (!text) return null;
    
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && line !== '•')
      .map((line: string, i: number) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 }}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{line.startsWith('•') ? line.slice(1).trim() : line}</Text>
        </View>
      ));
  };

  // Create a wrapper component for editable text
  const EditableText = ({ children, style, type, index, field }: any) => {
    const value = children?.toString() || '';
    
    return (
      <View style={style}>
        <Text style={[
          style,
          isEditing && { color: colors.primary }
        ]}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <Document>
      <Page 
        size="LETTER" 
        style={styles.page}
        wrap={false}
      >
        <View style={styles.outerSection}>
          <View style={styles.innerSectionLeft}>
            <EditableText 
              style={styles.header} 
              type="personal" 
              index={0} 
              field="name"
            >
              {personalData[0]?.name}
            </EditableText>
            <View style={styles.sectionHorizontal}>
              <Text>{personalData[0]?.phone}</Text>
              <Text>{personalData[0]?.city},</Text>
              <Text>{personalData[0]?.state}</Text>
              <Text>{personalData[0]?.email}</Text>
            </View>
          </View>


        <View style={styles.innerSectionRight}>
          <Text style={styles.textRight}>{personalData[0]?.website}</Text>
          <Text style={styles.textRight}>{personalData[0]?.github}</Text>
          <Text style={styles.textRight}>{personalData[0]?.linkedin}</Text>
        </View>


        </View>

        <View style={styles.section}>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeader}>Education</Text>
            <View style={styles.horizontalLine} />
          </View>
          {educationData?.map((education, index) => (
            <View key={index}>
              <View style={styles.topLine}>
                <Text style={styles.textHeader}>{education?.university}</Text>
                <Text style={styles.textBold}>{education?.major}, {education.level}</Text>
                <Text style={styles.text}>{education?.graduation_date}</Text>
              </View>
              <Text style={styles.text}>Coursework: {education?.coursework}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeader}>Work Experience</Text>
            <View style={styles.horizontalLine} />
          </View>
          {experienceData.map((experience, index) => (
            <View key={index}>
              <View style={styles.topLine}>
                <Text style={styles.textHeader}>{experience?.title}</Text>
                <Text style={styles.textBold}>{experience?.company}</Text>
                <Text style={styles.text}>{experience?.start_date} - {experience?.end_date}</Text>
              </View>
              {typeof experience.detailed_experience === 'string' 
                ? renderBulletPoints(experience.detailed_experience)
                : <Text style={styles.text}>No detailed experience available</Text>
              }
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeader}>Projects</Text>
            <View style={styles.horizontalLine} />
          </View>
          {projectData && projectData.map((project, index) => (
            <View key={index}>
              <View style={styles.row}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.textHeader}>{project?.name} -</Text>
                  <Text style={styles.text}> {project?.language}</Text>
                </View>
                <Link style={styles.link} src={project?.github}>
                  GitHub
                </Link>
              </View>
              
              {typeof project.description === 'string'
                ? renderBulletPoints(project.description)
                : <Text style={styles.text}>No project description available</Text>
              }
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.subHeaderContainer}>
            <Text style={styles.subHeader}>Skills</Text>
            <View style={styles.horizontalLine} />
          </View>
          {skillsData && skillsData?.map((skill, index) => (
            <View key={index}>
              <View style={styles.skillContainer}>
                <Text style={styles.skillLabel}>Languages:</Text>
                <Text style={styles.skillValue}>{skill?.languages}</Text>
              </View>
              <View style={styles.skillContainer}>
                <Text style={styles.skillLabel}>Frameworks:</Text>
                <Text style={styles.skillValue}>{skill?.frameworks}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default React.memo(MyDocument);
