import HeaderBar from "@insite/shell/Components/Shell/HeaderBar";
import Switcher from "@insite/shell/Components/Shell/Switcher";
import * as React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";

const MainHeader: React.FunctionComponent<{ match?: match; disabled?: boolean }> = ({ disabled, match }) => {
    return (
        <>
            <MainHeaderStyle>
                <HeaderBarStyle>
                    <HeaderBar disabled={disabled} />
                </HeaderBarStyle>
                <Switcher disabled={disabled} />
            </MainHeaderStyle>
        </>
    );
};

export default MainHeader;

const MainHeaderStyle = styled.div`
    height: ${({ theme }) => theme.headerHeight};
    background-color: #040a47;
    display: flex;
    flex-wrap: wrap;
`;

const HeaderBarStyle = styled.div`
    height: ${({ theme }) => theme.headerHeight};
    display: flex;
    flex-grow: 1;
`;
