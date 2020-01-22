#include "enterpage.h"
#include "ui_enterpage.h"

enterpage::enterpage(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::enterpage)
{
    ui->setupUi(this);
}

enterpage::~enterpage()
{
    delete ui;
}
