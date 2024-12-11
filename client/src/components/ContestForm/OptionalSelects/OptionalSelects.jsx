import React from 'react';
import CONSTANTS from '../../../constants';
import SelectInput from '../../SelectInput/SelectInput';
import FormInput from '../../InputComponents/FormInput/FormInput';
import styles from '../ContestForm.module.sass';
import Spinner from '../../Spinner/Spinner';
import ButtonGroup from '../ButtonGroup/ButtonGroup';

const OptionalSelects = (props) => {
  const { isFetching, contestType, dataForContest, classes, formData } = props;
  if (isFetching) {
    return <Spinner />;
  }
  // eslint-disable-next-line default-case
  switch (contestType) {
    case CONSTANTS.NAME_CONTEST: {
      return (
        <>
          <SelectInput
            name="typeOfName"
            header="Type of company"
            classes={{
              ...classes.inputClasses,
              input: styles.select,
            }}
            optionsArray={dataForContest.data.typeOfName}
          />
          <SelectInput
            name="styleName"
            header="Style name"
            classes={{
              ...classes.inputClasses,
              input: styles.select,
            }}
            optionsArray={dataForContest.data.nameStyle}
          />
          <ButtonGroup
            activeButton={formData.domain}
            optionsArray={CONSTANTS.BUTTON_GROUP}
            header="Do you want a matching domain (.com URL) with your name?"
            classes={{
              ...classes.inputClasses
            }}
          />
        </>
      );
    }
    case CONSTANTS.LOGO_CONTEST: {
      return (
        <>
          <FormInput
            name="nameVenture"
            type="text"
            header="What name of your venture?"
            label="name of venture"
            classes={{
              ...classes.inputClasses,
              input: styles.input,
            }}
          />
          <SelectInput
            name="brandStyle"
            header="Brand Style"
            classes={{
              ...classes.inputClasses,
              input: styles.select,
            }}
            optionsArray={dataForContest.data.brandStyle}
          />
        </>
      );
    }
    case CONSTANTS.TAGLINE_CONTEST: {
      return (
        <>
          <FormInput
            name="nameVenture"
            type="text"
            header="What name of your venture?"
            label="name of venture"
            classes={{
              ...classes.inputClasses,
              input: styles.input,
            }}
          />
          <SelectInput
            name="typeOfTagline"
            header="Type of tagline"
            classes={{
              ...classes.inputClasses,
              input: styles.select,
            }}
            optionsArray={dataForContest.data.typeOfTagline}
          />
        </>
      );
    }
  }
};

export default OptionalSelects;
