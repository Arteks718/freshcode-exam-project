import { useState, useRef } from 'react';
import classnames from 'classnames';
import styles from './Accordion.module.sass';

const Accordion = (props) => {
  const { question, answer } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const faqContentRef = useRef(null);

  const faqAccordionClassName = classnames(styles.faqAccordion, {
    [styles.active]: isExpanded,
  });

  const openAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={faqAccordionClassName}>
      <div className={styles.faqCaption} onClick={openAccordion}>
        {question}
      </div>
      <div
        className={styles.faqContent}
        ref={faqContentRef}
        style={{
          height: isExpanded && `${faqContentRef.current.scrollHeight}px`,
        }}
      >
        <div dangerouslySetInnerHTML={answer} className={styles.text} />
      </div>
    </div>
  );
};

export default Accordion;
