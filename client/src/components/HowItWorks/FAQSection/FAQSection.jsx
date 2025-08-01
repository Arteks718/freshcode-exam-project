import { useState, useCallback } from 'react';
import Accordion from './Accordion/Accordion';
import styles from './FAQSection.module.sass';
import HOW_IT_WORKS_CONSTANTS from '../howItWorksConstants';
import classNames from 'classnames';

const FAQSection = () => {
  const { faq } = HOW_IT_WORKS_CONSTANTS;
  const [currentTab, setCurrentTab] = useState(faq[0].id);

  const handleTabClick = useCallback(
    (id) => (event) => {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setCurrentTab(id);
    },
    []
  );

  const renderFaqBlocks = () =>
    faq.map(({ id, tab, questions }) => (
      <div className={styles.faqBlock} id={id} key={id}>
        <h4 className={styles.sectionTitle}>{tab}</h4>
        <div className={styles.faqList}>
          {questions.map((accordionItem, idx) => (
            <Accordion
              key={accordionItem.question + idx}
              question={accordionItem.question}
              answer={{ __html: accordionItem.answer }}
            />
          ))}
        </div>
      </div>
    ));

  const renderTabs = () =>
    faq.map(({ id, tab }) => (
      <a
        key={id}
        className={classNames(styles.tab, {
          [styles.active]: currentTab === id,
        })}
        href={`#${id}`}
        onClick={handleTabClick(id)}
      >
        {tab}
      </a>
    ));

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.title}>
          <h3>Frequently Asked Questions</h3>
        </div>
        <div className={styles.tabs}>{renderTabs()}</div>
        <div>{renderFaqBlocks()}</div>
      </div>
    </section>
  );
};

export default FAQSection;
