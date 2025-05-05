import axios from 'axios';
import '../Css/Search.css';
import React, { useActionState, useContext, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { Flex, Row, Col, Typography, Input, Button, Divider } from 'antd'
import { SearchOutlined } from "@ant-design/icons";

const handleSubmit = (params, formvalue) => {
    return formvalue.get("searching")
}

const Search = () => {

    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [totalHeadDetail, setTotalHeadDetail] = useState([])
    const [totalDetail, setTotalDetail] = useState([])
    const [dbStoringHeads, setDbStoringDatas] = useState([])

    // this detail for storing potencial data only in DB
    const runningTimer = useRef(0) // running time
    const timerResult = useRef(0) // Final output ( how much time user stay for url )

    useEffect(() => { // get scrapped Data
        if (pending || !formValue) return;
        try {
            let URL = `http://localhost:3002/scrap/search`;
            timerResult.current = ((Date.now() - runningTimer.current) / 1000).toFixed(2)
            axios.post(URL, { formData: formValue }).then((val) => {
                runningTimer.current = Date.now()
                setTotalHeadDetail(val?.data?.totalHeadDetail) // getting total Head Detail from DB
                setTotalDetail(val?.data?.totalDetail) // getting all detail when scrapped
                setDbStoringDatas(val?.data?.dbStoringHeadsAndURL)
            });
        } catch (err) {
            console.log(err);
        }
    }, [formValue])


    useEffect(() => { // Storing in DB process
        try {
            let URL = `http://localhost:3002/db/heads`;
            axios.post(URL, { timer: timerResult?.current, dbStoringHeadsAndURL: dbStoringHeads }).then((val) => {
                console.log(val.data);
            });
        } catch (err) {
            console.log(err);
        }
    }, [formValue])

    return (
        <div className='SearchModule'>
            <Row justify={'space-around'}>
                <Col span={12} className='scrappedValueWithHeading'>
                    <Row className='inputSearchField'>
                        <Col span={24}>
                            <form action={submit}>
                                <input type="search" name="searching" id="searching" placeholder='Seach anything' />
                                <input type="submit" className='searchButton' value="submit" />
                            </form>
                        </Col>
                    </Row>

                    <Row className='searchResult'>
                        <Col span={24}>
                            {!Array.isArray(totalHeadDetail) &&
                                <main>
                                    <Row style={{ padding: "10px 0" }}>
                                        <Typography.Link href={totalHeadDetail?.name} target="_blank" copyable>{totalHeadDetail?.URLName}</Typography.Link>
                                    </Row>

                                    <Row>
                                        <Col>
                                            {totalHeadDetail?.data?.map((val) => {
                                                return val?.paragraphs?.length > 0 && <Row>
                                                    <Col span={24}>
                                                        <Row>
                                                            <Typography.Title level={4}><span style={{ color: '#4ca30d', fontWeight: '400' }}>{val.heading}</span></Typography.Title>
                                                        </Row>
                                                        {val?.paragraphs?.map((paraValue) => {
                                                            return <Row style={{ marginLeft: '10px' }}><Typography.Paragraph> <p style={{ fontWeight: '200' }}> {paraValue} </p></Typography.Paragraph></Row>
                                                        })}
                                                        <Divider style={{ borderColor: '#4ca30d' }} />
                                                    </Col>
                                                </Row>
                                            })}
                                        </Col>
                                    </Row>
                                </main>
                            }
                        </Col>
                    </Row>
                </Col>
                <Col span={10} className='scrappedValueWithParas'>
                    <Row className='paraResult'>
                        <Col span={24}>
                            {totalDetail?.paras?.map((val) => {
                                return val !== '' && <Row>
                                    <Col span={24}>
                                        <Row>{val}</Row>
                                        <Divider style={{ borderColor: '#4ca30d' }} />
                                    </Col>
                                </Row>
                            })}
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default Search