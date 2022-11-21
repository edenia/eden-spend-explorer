import React, { memo, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { gql, GraphQLClient } from 'graphql-request'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@edenia/ui-kit'

import useDelegateReportState from '../../hooks/customHooks/useDelegateReportState'
import { GET_MEMBERS_DATA } from '../../gql'
import { classifyMemberRank } from '../../utils'
import AccordionComp from '../../components/Accordion'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'

import styles from './styles'

const useStyles = makeStyles(styles)

const DelegateReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { i18n } = useTranslation('translations')
  const [loader, setLoader] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [accordionList, setAccordionList] = useState([])
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const client = new GraphQLClient('https://eden-api.edenia.cloud/v1/graphql', {
    headers: {}
  })

  const [
    {
      electionRoundSelect,
      electionsByYearList,
      delegateList,
      maxLevel,
      dateElection
    },
    { setElectionRoundSelect, setDelegatesList }
  ] = useDelegateReportState()

  const dateFormat = new Date(dateElection).toLocaleDateString(
    i18n.language,
    options
  )

  const handleChangeSelectedElection = event => {
    setLoader(true)
    setElectionRoundSelect(Number(event))
  }

  useEffect(async () => {
    if (delegateList.length > 0 && delegateList[0].delegate_payer && maxLevel) {
      setLoader(true)
      const variables = {
        value: delegateList.reduce((reduceList, delegate) => {
          return [...reduceList, delegate.delegate_payer]
        }, []),
        orderBy: {
          election_rank: 'desc'
        },
        limit: 50
      }
      const response = await client.request(
        gql`
          ${GET_MEMBERS_DATA}
        `,
        variables
      )
      setDelegatesList(
        response.members.map(member => {
          const posDelegate = delegateList.find(
            delegate => delegate.delegate_payer === member.account
          )

          if (posDelegate) {
            const rank = classifyMemberRank(
              posDelegate.delegate_level,
              maxLevel
            )

            return { ...member, rank, totalRewarded: posDelegate.totalIncome }
          }

          return member
        })
      )
      setLoader(false)
    }
  }, [delegateList, maxLevel])

  useEffect(() => {
    setAccordionList(
      delegateList.filter(delegate => delegate?.account?.includes(searchValue))
    )
  }, [searchValue, delegateList])

  accordionList.sort((d1, d2) => {
    if (d1?.totalRewarded < d2?.totalRewarded) return 1
    else if (d1?.totalRewarded > d2?.totalRewarded) return -1
    else return 0
  })

  accordionList.sort((d1, d2) => {
    if (d1?.rank?.memberType < d2?.rank?.memberType) return 1
    else if (d1?.rank?.memberType > d2?.rank?.memberType) return -1
    else return 0
  })

  return (
    <div className={classes.root}>
      <div className={classes.headPage}>
        <div className={classes.textContainer}>
          <Typography variant="h6">
            {`${t('electionTime', { ns: 'delegateRoute' })}: ${dateFormat}`}
          </Typography>
          <Typography variant="h6">
            {t('instruction', { ns: 'delegateRoute' })}
          </Typography>
        </div>
        <div id="treasury-container-id">
          <TreasuryBalance />
        </div>
      </div>
      <div className={classes.filtersContainer}>
        <div id="id-select-election-container">
          <>
            <Autocomplete
              id="combo-box-demo"
              sx={{ width: 300 }}
              options={delegateList.map(data => data.account)}
              onInputChange={(event, newInputValue) => {
                setSearchValue(newInputValue)
              }}
              autoHighlight
              clearOnEscape
              renderInput={params => (
                <TextField {...params} label="Delegate" variant="outlined" />
              )}
            />
            <SelectComponent
              onChangeFunction={event => handleChangeSelectedElection(event)}
              labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
              values={electionsByYearList.map(data => `${data.election}`)}
              actualValue={electionRoundSelect}
              width={200}
            />
          </>
        </div>
      </div>
      <div className={classes.content}>
        {loader ? (
          <div className={classes.spinner}>
            <Spinner />
          </div>
        ) : (
          accordionList.map(delegate => (
            <AccordionComp
              key={delegate?.account}
              nameDelegate={delegate?.name}
              accountDelegate={delegate?.account}
              imageDelegate={delegate?.profile?.image}
              avatarIcon={delegate?.rank?.badge}
              delegateLevel={delegate?.rank?.label}
              eosRewarded={delegate?.totalRewarded}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default memo(DelegateReport)
