import React from 'react';
import {
    Button,
    Checkbox,
    Select
} from '@douyinfe/semi-ui';

const {Option} = Select;

export default function Semi(){


    return <div>
        <h2>Semi</h2>
        <Button>按钮</Button>
        <Checkbox>多选框</Checkbox>
        <Select>
            <Option key={1}>1</Option>
            <Option key={2}>2</Option>
            <Option key={3}>3</Option>
        </Select>
    </div>
}