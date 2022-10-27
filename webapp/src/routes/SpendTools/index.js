import React, { memo } from 'react'

import Select from '@mui/material/Select'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import { MenuItem } from '@mui/material'

// import { makeStyles } from '@mui/styles'

// import styles from './styles'

// const useStyles = makeStyles(styles)

const SpendTools = () => {
  // const classes = useStyles()

  return (
    <div style={{ border: '1px solid', margin: '8px 16px' }}>
      <div>A set of tools that will help you perform new transactions with</div>

      <div style={{ marginTop: '24px' }}>
        Use this space to provide help so the users understand how to do things.
      </div>

      <div
        style={{
          display: 'flex',
          flexGrow: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '16px',
          padding: '8px 16px',
          margin: '24px 0 24px 0',
          border: '1px solid green'
        }}
      >
        <div
          style={{
            width: '345px',
            height: '74px',
            flexGrow: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            gap: '4px',
            padding: 0
          }}
        >
          <InputLabel
            style={{
              width: '102px',
              height: '22px',
              flexGrow: 0,
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 'normal',
              fontStretch: 'normal',
              fontStyle: 'normal',
              lineHeight: '1.57',
              letterSpacing: '-0.28px',
              textAlign: 'left',
              color: '#667080'
            }}
          >
            Your Account Name
          </InputLabel>
          <Input
            style={{
              alignSelf: 'stretch',
              flexGrow: 1,
              borderRadius: '6px',
              border: 'solid 1px #667080',
              backgroundColor: '#fff'
            }}
            type="text"
          />
        </div>
        <div
          style={{
            width: '345px',
            height: '74px',
            flexGrow: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            gap: '4px',
            padding: 0
          }}
        >
          <InputLabel
            style={{
              width: '102px',
              height: '22px',
              flexGrow: 0,
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 'normal',
              fontStretch: 'normal',
              fontStyle: 'normal',
              lineHeight: '1.57',
              letterSpacing: '-0.28px',
              textAlign: 'left',
              color: '#667080'
            }}
          >
            Category
          </InputLabel>
          <Select
            style={{
              alignSelf: 'stretch',
              height: '48px',
              borderRadius: '6px',
              border: 'solid 1px #667080',
              backgroundColor: '#fff'
            }}
          >
            <MenuItem>Holi</MenuItem>
          </Select>
        </div>
        <div
          style={{
            width: '345px',
            height: '74px',
            flexGrow: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            gap: '4px',
            padding: 0
          }}
        >
          <InputLabel
            style={{
              width: '102px',
              height: '22px',
              flexGrow: 0,
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 'normal',
              fontStretch: 'normal',
              fontStyle: 'normal',
              lineHeight: '1.57',
              letterSpacing: '-0.28px',
              textAlign: 'left',
              color: '#667080'
            }}
          >
            Description
          </InputLabel>
          <Input
            style={{
              alignSelf: 'stretch',
              flexGrow: 1,
              borderRadius: '6px',
              border: 'solid 1px #667080',
              backgroundColor: '#fff'
            }}
            type="text"
          />
        </div>
      </div>

      <div
        style={{
          margin: '16px 0 16px 0',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          style={{
            width: '345px',
            height: '48px',
            flexGrow: '0',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 16px',
            backgroundColor: '#2563eb',
            borderRadius: 0
          }}
        >
          <label
            style={{
              width: '266px',
              height: '16px',
              flexGrow: '0',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: '500',
              fontStretch: 'normal',
              fontStyle: 'normal',
              lineHeight: 1.14,
              letterSpacing: '1px',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            Justify expense
          </label>
        </Button>
      </div>
      <div style={{ border: '1px solid' }}>
        <div
          style={{
            border: '1px solid red',
            fontFamily: 'Inter',
            fontSize: '18px',
            fontWeight: '500',
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: '1.56',
            letterSpacing: '-0.4px',
            textAlign: 'left',
            color: 'rgba(0, 0, 0, 0.87)',
            margin: '16px 0 32px 0'
          }}
        >
          <label>
            <span>Tokens Sent By Your Account</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default memo(SpendTools)
