import React from 'react';
import styles from './HomeHeroSection.module.sass';
import ReactPlayer from 'react-player';
import { compareAsc, format } from 'date-fns';

const HomeHeroSection = () => {
  return (
    <section className={styles.homeHeroSection}>
      <div className={styles.homeHeroContainer}>
        <div className={styles.textBlock}>
          <h4 className={styles.tag}>World's #1 Naming Platform</h4>
          <h1 className={styles.title}>How Does Atom Work?</h1>
          <p className={styles.desc}>
            Atom helps you come up with a great name for your business by
            combining the power of sourcing with sophisticated technology and
            Agency-level validation services. fhfgh
          </p>
        </div>
        {/* <div className={styles.videoBlock}>
          <ReactPlayer
            className={styles.video}
            width={"100%"}
            height={"100%"}
            url="https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362"
            controls={true}
          />
        </div> */}
        <div className={styles.videoBlock}>
          <div className={styles.videoElement}>
            <iframe
              src="https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362"
              loading="lazy"
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowfullscreen="true"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
