import { Col, Row, Image, Button, Tooltip, Spin } from 'antd'
import React, { useActionState, useContext, useEffect, useState } from 'react'
import '../Css/ListSearch.css'
import { UserContext } from '../App'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FastBackwardFilled, LoadingOutlined, SearchOutlined } from '@ant-design/icons'

const isURL = (input) => { // checking Incoming params is URL or not 
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(input.trim());
}

const ListSearch = () => {
    const handleSubmit = (params, formvalue) => {
        let value = formvalue.get("searching")
        setDynamicURL(value)
        return value
    }

    const { setDynamicURL, dynamicURL } = useContext(UserContext)
    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [searchingList, setSearchingList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const URL = `https://scrapping-node-server.vercel.app/scrap/search`

    // scrpping function
    const scrapping = (URL, formValue) => {
        setDynamicURL(formValue)
        try {
            if (pending || !formValue) return;
            if (isURL(formValue)) {
                dynamicScrapURL(formValue)
                return
            }
            setIsLoading(true)
            axios.post(URL, { formData: formValue }).then((val) => {
                setSearchingList(val?.data)
                setIsLoading(false)
            });

        } catch (err) {
            console.log(err);
        }
    }

    // gett scrapped Data 
    useEffect(() => {
        scrapping(URL, dynamicURL)
    }, [formValue])

    //this code navigate to seach page and scrap the current URL given by DB 
    const dynamicScrapURL = (scrappingURL) => {
        setDynamicURL(scrappingURL)
        navigate('/search')
    }

    return (
        <div className='listSearch'>
            <main className='searchListMain'>
                <Row className='inputSearchFieldSearch'>
                    <Col span={24}>
                        <form action={submit}>
                            <input type="search" name="searching" className='searching' placeholder='Search by Enter keywords...' />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                htmlType="submit"
                                className="searchButton"
                            ></Button>

                        </form>
                    </Col>
                </Row>
                <Row className='searchResultListMain'>
                    <Col span={24}>
                        {!isLoading ? <>
                            {searchingList?.length > 0 ? searchingList.map((value) => {
                                return <Tooltip title={"View Details"} placement='bottomLeft' color='blue'>
                                    <Row className='searchResultList'>
                                        <Col span={24}>
                                            <Row>
                                                <Col span={16}>
                                                    <Row><a href={value.URLName} target='_blank'>{value.URLName}</a></Row>
                                                    <Row onClick={() => dynamicScrapURL(value.URLName)}>
                                                        <ul>
                                                            {value.heading[0].map((value) => {
                                                                return <li className='listValueName'>{value}</li>
                                                            })}
                                                        </ul>
                                                    </Row>
                                                </Col>
                                                <Col span={8} className='imagesHead'>
                                                    {value.images.map(img => {
                                                        return <Row className='imagesRow'>
                                                            <Image src={img} className='image' style={{ minHeight: '100px', maxHeight: '100px', minWidth: '100px', maxWidth: '100px' }} preview={true}></Image>
                                                        </Row>
                                                    })}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Tooltip>
                            }) : <Row className='notFoundImagesRow'>
                                <Col span={24} className='notFoundImageColum'>
                                    <Row className='notFoundImageColumRowText'>We can't seem to find the page you are looking for.</Row>
                                    <Row><Image src={'https://www.zoho.com/images/zoho-404-video.gif'} className='noResultImage' preview={true}></Image></Row>
                                </Col>
                            </Row>}</> :
                            <Row className='notFoundImagesRow'>
                                <Col span={24} className='notFoundImageColum'>
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </main>
        </div>

    )
}

export default ListSearch

// timerResult.current = ((Date.now() - runningTimer.current) / 1000).toFixed(2) // this code follow the time Spend for every request by user.(it only store the datas in DB when the time duration is more than 5 secounds)