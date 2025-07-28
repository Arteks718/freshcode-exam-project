import { useState } from 'react';
import Accordion from './Accordion/Accordion';
import styles from './FAQSection.module.sass';
import HOW_IT_WORKS_CONSTANTS from '../howItWorksConstants';
import classNames from 'classnames';

const FAQSection = () => {
  const { faq } = HOW_IT_WORKS_CONSTANTS;
  const [currentTab, setCurrentTab] = useState(faq[0].id);

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.title}>
          <h3>Frequently Asked Questions</h3>
        </div>
        <div className={styles.tabs}>
          {faq.map((item) => {
            const isActive = currentTab === item.id;
            const currentTabClassname = classNames(styles.tab, {
              [styles.active]: isActive,
            });
            const selectCurrentTab = (event) => {
              event.preventDefault()
              const element = document.getElementById(item.id)
              element?.scrollIntoView({
                behavior:'smooth'
              })

              setCurrentTab(item.id);

            };

            return (
              <a
                className={currentTabClassname}
                href={`#${item.id}`}
                onClick={selectCurrentTab}
              >
                {item.tab}
              </a>
            );
          })}
        </div>
        <div>
          {faq.map((item) => {
            return (
              <div className={styles.faqBlock} id={item.id}>
                <h4 className={styles.sectionTitle}>{item.tab}</h4>
                <div className={styles.faqList}>
                  {item.questions.map((accordionItem) => (
                    <Accordion
                      question={accordionItem.question}
                      answer={{
                        __html: accordionItem.answer,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
